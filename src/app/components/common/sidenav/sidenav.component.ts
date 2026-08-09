import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { Notification, Sidenav } from '../../../shared/interface/sidenav';
import { ApiService } from '../../../shared/service/api/api.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { StorageService } from '../../../shared/service/common/storage.service';
import { KeyService } from '../../../shared/service/common/key.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SHARED_CUSTOM_PIPES } from '../../../shared/common/shared-pipe';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES, SHARED_CUSTOM_PIPES],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('expandCollapseAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  @Output() navigateEvent = new EventEmitter<string>();
  private destroy$ = new Subject<void>();

  menuItems = signal<Sidenav[]>([]);
  expandedMenus = new Set<string>();

  UserName: string = '';
  UserEmail: string = '';

  token: string | null = null;
  RoleName: any;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  sidenavMode: 'side' | 'over' = 'side';
  isSmallScreen = false;

  profileImage: string = '';
  defaultAvatar: string =
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

  department: string = '';
  EmployeeNo: string = '';

  notifications: Array<any> = [];

  unreadCount: number = 0;

  isNotificationLoading = false;

  constructor(
    private apiService: ApiService,
    public commonService: CommonService,
    private storageService: StorageService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.observeScreenSize();
    this.commonService.setUserDetailsFromToken();
    const currentUser = this.commonService.getCurrentUserDetails();
    this.EmployeeNo = currentUser.empNo;
    this.RoleName = currentUser.role;
    this.department = currentUser.department;
    this.RoleName = currentUser.role;
    this.UserName = `${currentUser.firstName} ${currentUser.lastName}`;
    this.profileImage = currentUser.profileImage
      ? currentUser.profileImage
      : this.defaultAvatar;

    if (typeof window !== 'undefined') {
      this.token =
        this.storageService.getItem('token', 'session') ||
        this.storageService.getItem('token', 'local');
      // console.log(token);
    }

    if (this.token) {
      this.loadRoleBasedMenus();
      this.getSubscribingNotifications();
    }
  }

  loadRoleBasedMenus() {
    const payload = {
      role: this.RoleName || '',
    };
    this.apiService
      .menuApiCall(API_ENDPOINTS.SERVICE_ROLEWISEMENUS, payload)
      .subscribe((res: any) => {
        if (res?.status === 'success') {
          const menus = res.data.filteredMenus;

          console.log(menus);

          const nestedMenus = menus.map((menu: any) =>
            this.transformMenu(menu),
          );
          console.log(nestedMenus);
          this.menuItems.set(
            nestedMenus.sort(
              (a: { sequence: number }, b: { sequence: number }) =>
                a.sequence - b.sequence,
            ),
          );
        }
      });
  }

  transformMenu(menu: any): Sidenav {
    const transformed: Sidenav = {
      id: menu._id,
      title: menu.title,
      icon: menu.icon,
      route: menu.path,
      sequence: menu.sequence,
      children:
        menu.childMenu?.map((child: any) => this.transformMenu(child)) || [],
    };
    return transformed;
  }

  buildMenuTree(flat: any[]) {
    const map = new Map<string, any>();
    const roots: any[] = [];
    flat.forEach((item) => {
      item.children = [];
      map.set(item.id, item);
    });
    flat.forEach((item) => {
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId).children.push(item);
      } else {
        roots.push(item);
      }
    });
    return roots.sort((a, b) => a.sequence - b.sequence);
  }

  toggleSubMenu(menuId: string): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  trackById(index: number, item: any): string {
    return item.id;
  }

  navigateTO(url: string) {
    // debugger
    this.navigateEvent.emit(url);
  }

  confirmLogout() {
    this.commonService
      .showConfirmationDialog({
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.logout();
        } else {
          this.router.navigate(['/dashboard']);
        }
      });
  }

  logout() {
    this.apiService.authApiCall(API_ENDPOINTS.SERVICE_LOG_OUT, {}).subscribe({
      next: (res: any) => {
        this.checkOutEmployeeAttendence();
        sessionStorage.removeItem('token');
        sessionStorage.clear();
        this.commonService.clearUserDetails();
        this.commonService.openSnackbar(res.message, 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.commonService.openSnackbar(error.error.message, 'error');
      },
    });
  }

  checkOutEmployeeAttendence() {
    const paylaod = {
      email: this.commonService.getCurrentUserDetails().email
        ? this.commonService.getCurrentUserDetails().email
        : '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_CHECK_OUT_ATTENDENCE, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_SAVE_NEW_USER} Response : `,
            res,
          );
          this.getSubscribingNotifications();

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  toggle() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  observeScreenSize() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
        this.sidenavMode = this.isSmallScreen ? 'over' : 'side';

        if (this.sidenav && this.isSmallScreen) {
          this.sidenav.close();
        }
      });
  }

  isDefaultAvatar(): boolean {
    return !this.profileImage || this.profileImage === this.defaultAvatar;
  }

  gotoDashboard() {
    this.router.navigate(['./dashboard']);
  }

  goToProfile(): void {
    this.router.navigate(['./employee-profile']);
  }

  loadNotifications(): void {
    const payload = {
      empNo: this.EmployeeNo,
      page: 1,
      limit: 10,
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_NOTIFICATIONS, payload)
      .subscribe({
        next: (res: any) => {
          if (res?.status === 'success') {
            const notifications = res.data.notifications || [];

            const formatted = notifications.map((item: Notification) => ({
              ...item,
              time: this.getNotificationTime(item.createdAt),
            }));

            // 🔥 Update BehaviorSubject
            this.commonService.setNotifications(formatted);
          }
        },

        error: (error) => {
          console.error('Notification API Error:', error);
        },
      });
  }

  loadUnreadNotificationCount(): void {
    const payload = {
      empNo: this.EmployeeNo,
    };

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_GET_UNREAD_NOTIFICATIONS_COUNT,
        payload,
      )
      .subscribe({
        next: (res: any) => {
          if (res?.status === 'success') {
            const count = res.data.unreadCount || 0;

            // 🔥 Update BehaviorSubject
            this.commonService.setUnreadCount(count);
          }
        },

        error: (error) => {
          console.error('Unread count API Error:', error);
        },
      });
  }

  openNotification(item: Notification): void {
    if (!item.isRead) {
      this.markNotificationAsRead(item);
    }

    // Optional navigation
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  markNotificationAsRead(item: Notification): void {
    if (!item._id || item.isRead) {
      return;
    }

    const payload = {
      notificationId: item._id,
      empNo: this.EmployeeNo,
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_MARK_READ_NOTIFICATIONS, payload)
      .subscribe({
        next: (res: any) => {
          if (res?.status === 'success') {
            item.isRead = true;

            item.readAt =
              res?.data?.notification?.readAt || new Date().toISOString();

            // Badge update immediately
            this.unreadCount = Math.max(this.unreadCount - 1, 0);
          }
        },

        error: (error) => {
          console.error('Mark Notification Read Error:', error);
        },
      });
  }

  markAllRead(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.EmployeeNo) {
      return;
    }

    if (this.unreadCount === 0) {
      return;
    }

    const payload = {
      empNo: this.EmployeeNo,
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_MARK_ALL_READ_NOTIFICATIONS, payload)
      .subscribe({
        next: (res: any) => {
          if (res?.status === 'success') {
            this.notifications = this.notifications.map((item) => ({
              ...item,
              isRead: true,
              readAt: new Date().toISOString(),
            }));

            this.unreadCount = 0;
          }
        },

        error: (error) => {
          console.error('Mark All Notifications Read Error:', error);
        },
      });
  }

  getNotificationTime(createdAt: string): string {
    if (!createdAt) {
      return '';
    }

    const created = new Date(createdAt).getTime();

    const now = new Date().getTime();

    const difference = Math.floor((now - created) / 1000);

    if (difference < 60) {
      return 'Just now';
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return new Date(createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  viewAllNotifications() {
    this.router.navigate(['/notifications']);
  }

  getSubscribingNotifications() {
    this.commonService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });

    this.commonService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.unreadCount = count;
      });

    this.commonService.notificationRefresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe((refresh) => {
        if (refresh) {
          this.refreshNotificationData();
        }
      });

    this.refreshNotificationData();
  }

  refreshNotificationData(): void {
    this.loadNotifications();

    this.loadUnreadNotificationCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
