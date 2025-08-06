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
          ])
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

  todayAttendenceSummary: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.openCheckIns();
    this.getparams();
    if (this.commonService.getCurrentUserDetails().role !== 'Employee') {
      this.getEmployeeRequestList();
    }
    const currentUser = this.commonService.getCurrentUserDetails();
    this.profileImage = currentUser.profileImage
      ? currentUser.profileImage
      : this.defaultAvatar;
  }

  openCheckIns() {
    // debugger
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
          this.upcomingHolidays
        );

        this.eventList =
          params['data'].getEmployeeMeetingList.data?.meetings || [];

        console.log('Meetings---->', this.eventList);

        this.todayAttendenceSummary =
          params['data'].todayAttendenceSummary?.summary || {};
        console.log(
          'todayAttendenceSummary ---->',
          this.todayAttendenceSummary
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
        paylaod
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST} Response : `,
            res
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

  activeTab: 'birthdays' | 'anniversaries' | 'newJoinees' = 'newJoinees';

  birthdayList = [
    { name: 'Aditi Sharma', image: 'assets/images/aditi.png' },
    { name: 'Ravi Kumar', image: 'assets/images/ravi.png' },
  ];

  anniversaryList = [
    { name: 'Neha Jain', image: 'assets/images/neha.png' },
    { name: 'Manoj Tiwari', image: 'assets/images/manoj.png' },
  ];

  joineeList = [
    { name: 'Vedangi Pandav', image: 'assets/images/vedangi.png' },
    { name: 'Siddharth Rao', image: 'assets/images/siddharth.png' },
  ];

  currentIndex = 0;
  wishMessage = '';

  // Dynamically get current list based on active tab
  get currentList() {
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

  // Currently visible person
  get currentPerson() {
    return this.currentList[this.currentIndex] || { name: '', image: '' };
  }

  changeTab(tab: 'birthdays' | 'anniversaries' | 'newJoinees') {
    this.activeTab = tab;
    this.currentIndex = 0;
  }

  prevPerson() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  nextPerson() {
    if (this.currentIndex < this.currentList.length - 1) this.currentIndex++;
  }

  sendWish() {
    if (this.wishMessage.trim()) {
      console.log(
        `Wish sent to ${this.currentPerson.name}: ${this.wishMessage}`
      );
      this.wishMessage = '';
    }
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
