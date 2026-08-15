import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { ApiService } from '../../../shared/service/api/api.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { CheckInsComponent } from '../attendence/check-ins/check-ins.component';
import { EventsDialogComponent } from '../../../shared/widget/dialog/events-dialog/events-dialog.component';
import { ChatBotDialogComponent } from '../../../shared/widget/dialog/chat-bot-dialog/chat-bot-dialog.component';
import { EmployeeWish, TodayPerson } from '../../../shared/interface/user';
import { EmployeeWishesDialogComponent } from '../../../shared/widget/dialog/employee-wishes-dialog/employee-wishes-dialog.component';

interface EventItem {
  _id: string;
  title: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  meetingType: string;
  platform?: string | null;
  location: string;
  meetingLink?: string;
  description: string;
  attendees: {
    attendeesName: string;
    email: string;
    avatar: string;
    empNo: string;
    _id: string;
  }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('scrollUp', [
      transition('* => *', [
        animate(
          '15s linear',
          keyframes([
            style({ transform: 'translateY(0%)', opacity: 1, offset: 0 }),
            style({ transform: 'translateY(-100%)', opacity: 0.5, offset: 1 }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent {
  hasCheckedIn: any;
  animationState = false;
  pauseAnimation = false;
  upcomingHolidays: Array<any> = [];
  pendingRequestCount: any;
  eventList: Array<any> = [];

  profileImage: string = '';
  defaultAvatar: string =
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

  activeTab: 'birthdays' | 'anniversaries' | 'newJoinees' = 'newJoinees';

  currentIndex = 0;
  wishMessage = '';

  birthdayList: TodayPerson[] = [];

  anniversaryList: TodayPerson[] = [];

  joineeList: TodayPerson[] = [];
  wishes: EmployeeWish[] = [];

  wishCount = 0;

  isLoadingWishes = false;

  showWishes = false;

  todayAttendenceSummary: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    public commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.openCheckIns();
    this.getparams();
    this.getEmployeeRequestList();
    this.getTodayPeopleMoments();
    const currentUser = this.commonService.getCurrentUserDetails();
    this.profileImage = currentUser.profileImage
      ? currentUser.profileImage
      : this.defaultAvatar;

    if (typeof window !== 'undefined') {
      this.hasCheckedIn = sessionStorage.getItem('checkIns');
      if (this.hasCheckedIn) {
        this.commonService.refreshNotifications();
      }
    }
  }

  openCheckIns() {
    //
    if (typeof window !== 'undefined') {
      this.hasCheckedIn = sessionStorage.getItem('checkIns');
    }

    if (!this.hasCheckedIn) {
      const dialogRef = this.dialog.open(CheckInsComponent, {
        width: '600px',
        disableClose: true,
        data: { mode: 'checkins' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
          this.showEmployeePopupIfAny();
          this.commonService.refreshNotifications();
        }
      });
    }
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationState = !this.animationState;
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      // console.log('Params Leave Management ---->', params);

      if (params['data']) {
        this.upcomingHolidays =
          params['data'].getUpcomingHoliday?.data?.upComingHolidays || [];

        this.upcomingHolidays = this.getCurrentAndNextMonthHolidays(
          this.upcomingHolidays,
        );

        this.eventList =
          params['data'].getEmployeeMeetingList.data?.meetings || [];

        console.log('Meetings---->', this.eventList);

        this.todayAttendenceSummary =
          params['data'].todayAttendenceSummary?.summary || {};
        console.log(
          'todayAttendenceSummary ---->',
          this.todayAttendenceSummary,
        );
      }
    });
  }

  getCurrentAndNextMonthHolidays(holidays: any[]): any[] {
    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const nextMonth = (currentMonth + 1) % 12;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return holidays
      .map((holiday) => {
        const dateObj = new Date(holiday.date);

        return {
          ...holiday,
          dateObj,
          name: this.cleanName(holiday.name),
        };
      })
      .filter((holiday) => {
        const m = holiday.dateObj.getMonth();
        const y = holiday.dateObj.getFullYear();

        return (
          (m === currentMonth && y === currentYear) ||
          (m === nextMonth && y === nextMonthYear)
        );
      });
  }

  private cleanName(name: string): string {
    return name.replace(/\s*\(.*?\)/g, '').trim();
  }

  getEmployeeRequestList() {
    const currentUser = this.commonService.getCurrentUserDetails();

    const paylaod = {
      approverEmpNo: currentUser.empNo || '',
    };

    console.log('SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST paylaod', paylaod);

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST,
        paylaod,
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST} Response : `,
            res,
          );

          this.pendingRequestCount = res?.totalRecords || '';

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  navigateToRequestList() {
    this.router.navigate(['/request-list']);
  }

  handleNotificationClick(): void {
    if (this.pendingRequestCount && this.pendingRequestCount > 0) {
      this.navigateToRequestList();
    }
  }

  showEmployeePopupIfAny(): void {
    const user = this.commonService.getCurrentUserDetails();

    const paylaod = {
      employee: user.empNo || '',
    };

    this.apiService
      .authApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_POPUP_DETAILS, paylaod)
      .subscribe({
        next: (resp: any) => {
          const popups: any[] = resp?.data;
          console.log(popups);

          if (!popups || popups.length === 0) {
            return;
          }

          this.displayPopupSequence(popups, 0);
        },
        error: (error) => {
          console.error('Popup Fetch Error:', error);
        },
      });
  }

  displayPopupSequence(popups: any[], index: number): void {
    if (index >= popups.length) {
      return;
    }

    const popup = popups[index];

    if (popup.popupType === 'text') {
      this.commonService
        .showAlertDialog({
          title: popup.name,
          message: popup.textMessage || 'No message',
        })
        .subscribe(() => {
          this.displayPopupSequence(popups, index + 1);
        });
    } else {
      const fileUrl = popup.uploadedFile;
      const extension = this.commonService.returnFilenameExtension(fileUrl);

      const isImage = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'svg',
      ].includes(extension || '');

      const dialogRef = isImage
        ? this.commonService.viewImageViewer(popup.uploadedFile, fileUrl)
        : this.commonService.viewDocumentViewer(popup.uploadedFile, fileUrl);

      dialogRef.afterClosed().subscribe(() => {
        this.displayPopupSequence(popups, index + 1);
      });
    }
  }

  get currentList(): TodayPerson[] {
    switch (this.activeTab) {
      case 'birthdays':
        return this.birthdayList;

      case 'anniversaries':
        return this.anniversaryList;

      case 'newJoinees':
      default:
        return this.joineeList;
    }
  }

  get currentPerson(): TodayPerson | null {
    return this.currentList[this.currentIndex] || null;
  }

  changeTab(tab: 'birthdays' | 'anniversaries' | 'newJoinees'): void {
    this.activeTab = tab;

    this.currentIndex = 0;

    this.wishMessage = '';

    this.wishes = [];

    this.showWishes = false;
  }

  prevPerson(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;

      this.wishes = [];

      this.showWishes = false;
    }
  }

  nextPerson(): void {
    if (this.currentIndex < this.currentList.length - 1) {
      this.currentIndex++;

      this.wishes = [];

      this.showWishes = false;
    }
  }

  getTodayPeopleMoments(): void {
    this.apiService
      .authApiCall(API_ENDPOINTS.SERVICE_GET_TODAY_CELEBRATIONS_PEOPLE, {})
      .subscribe({
        next: (res: any) => {
          console.log('Today People Moments:', res);

          this.birthdayList = res?.data?.birthdays || [];

          this.anniversaryList = res?.data?.anniversaries || [];

          this.joineeList = res?.data?.newJoinees || [];

          this.currentIndex = 0;
          this.loadCurrentUserWishes();
        },

        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');

          this.birthdayList = [];

          this.anniversaryList = [];

          this.joineeList = [];

          this.currentIndex = 0;
        },
      });
  }

  sendWish(): void {
    const message = this.wishMessage.trim();

    if (!message || !this.currentPerson) {
      return;
    }
    const occasionType =
      this.activeTab === 'birthdays'
        ? 'birthday'
        : this.activeTab === 'anniversaries'
          ? 'anniversary'
          : 'newJoinee';

    const payload = {
      recipientEmpNo: this.currentPerson.empNo,

      occasionType,

      message,
    };

    this.apiService
      .authApiCall(API_ENDPOINTS.SERVICE_SEND_EMPLOYEE_WISH, payload)
      .subscribe({
        next: (res: any) => {
          console.log('Wish sent:', res);

          this.wishMessage = '';

          this.commonService.openSnackbar(
            'Wish sent successfully 🎉',
            'success',
          );

          // Refresh wishes if currently viewing
        },

        error: (error) => {
          console.error('Send wish error:', error);

          this.commonService.openSnackbar(
            error?.error?.message || 'Unable to send wish',
            'error',
          );
        },
      });
  }

  getEmployeeWishes(
    occasionType?: 'birthday' | 'anniversary' | 'newJoinee',
  ): void {
    const currentUser = this.commonService.getCurrentUserDetails();

    if (!currentUser?.empNo) {
      return;
    }

    const finalOccasionType =
      occasionType ||
      (this.activeTab === 'birthdays'
        ? 'birthday'
        : this.activeTab === 'anniversaries'
          ? 'anniversary'
          : 'newJoinee');

    const payload = {
      EmpNo: currentUser.empNo,
      occasionType: finalOccasionType,
    };

    console.log('Get Employee Wishes Payload:', payload);

    this.isLoadingWishes = true;

    this.apiService
      .authApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_WISHES, payload)
      .subscribe({
        next: (res: any) => {
          console.log('Employee Wishes Response:', res);

          this.wishes = res?.data?.wishes || [];

          this.wishCount = this.wishes.length;

          this.isLoadingWishes = false;
        },

        error: (error) => {
          console.error('Get wishes error:', error);

          this.wishes = [];

          this.wishCount = 0;

          this.isLoadingWishes = false;
        },
      });
  }

  isCurrentUserCelebrationPerson(): boolean {
    const currentUser = this.commonService.getCurrentUserDetails();

    return (
      !!currentUser?.empNo &&
      !!this.currentPerson?.empNo &&
      currentUser.empNo === this.currentPerson.empNo
    );
  }

  openWishesDialogWithData(): void {
    const currentPerson = this.currentPerson;

    if (!currentPerson) {
      return;
    }

    const occasion =
      this.activeTab === 'birthdays'
        ? 'birthday'
        : this.activeTab === 'anniversaries'
          ? 'anniversary'
          : 'newJoinee';

    this.dialog.open(EmployeeWishesDialogComponent, {
      width: '620px',

      maxWidth: '94vw',

      maxHeight: '90vh',

      autoFocus: false,

      panelClass: 'employee-wishes-dialog',

      data: {
        employeeName: currentPerson.name,

        occasion: occasion,

        wishes: this.wishes,

        defaultAvatar: this.defaultAvatar,
      },
    });
  }

  loadCurrentUserWishes(): void {
    const currentUser = this.commonService.getCurrentUserDetails();

    if (!currentUser?.empNo) {
      return;
    }

    const empNo = currentUser.empNo;

    // Check birthday
    const birthdayPerson = this.birthdayList.find(
      (person) => person.empNo === empNo,
    );

    if (birthdayPerson) {
      this.activeTab = 'birthdays';

      this.currentIndex = this.birthdayList.findIndex(
        (person) => person.empNo === empNo,
      );

      this.getEmployeeWishes('birthday');

      return;
    }

    // Check anniversary
    const anniversaryPerson = this.anniversaryList.find(
      (person) => person.empNo === empNo,
    );

    if (anniversaryPerson) {
      this.activeTab = 'anniversaries';

      this.currentIndex = this.anniversaryList.findIndex(
        (person) => person.empNo === empNo,
      );

      this.getEmployeeWishes('anniversary');

      return;
    }

    // Check new joinee
    const joineePerson = this.joineeList.find(
      (person) => person.empNo === empNo,
    );

    if (joineePerson) {
      this.activeTab = 'newJoinees';

      this.currentIndex = this.joineeList.findIndex(
        (person) => person.empNo === empNo,
      );

      this.getEmployeeWishes('newJoinee');

      return;
    }

    // Current user has no celebration today
    this.wishes = [];
    this.wishCount = 0;
  }

  openAllEventsDialog() {
    this.dialog.open(EventsDialogComponent, {
      width: '600px',
      data: this.eventList,
    });
  }

  getColorByDay(date: Date): string {
    const day = new Date(date).getDay();
    switch (day) {
      case 0:
        return '#e74c3c'; // Sunday
      case 1:
        return '#2980b9'; // Monday
      case 2:
        return '#9b59b6'; // Tuesday
      case 3:
        return '#1abc9c'; // Wednesday
      case 4:
        return '#f1c40f'; // Thursday
      case 5:
        return '#2ecc71'; // Friday
      case 6:
        return '#e67e22'; // Saturday
      default:
        return '#7f8c8d'; // fallback
    }
  }

  openChatbotDialog() {
    this.dialog.open(ChatBotDialogComponent, {
      panelClass: 'chatbot-dialog-panel',
      width: '350px',
      height: '500px',
      position: { bottom: '80px', right: '20px' },
      backdropClass: 'no-backdrop',
    });
  }
}
