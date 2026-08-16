import { Component, Inject } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { ApiService } from '../../../shared/service/api/api.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Notification } from '../../../shared/interface/sidenav';

type NotificationFilter = 'all' | 'unread' | 'read';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  private destroy$ = new Subject<void>();

  // =====================================================
  // DATA
  // =====================================================

  notifications: Notification[] = [];

  displayedNotifications: Notification[] = [];

  // =====================================================
  // USER
  // =====================================================

  EmployeeNo = '';

  // =====================================================
  // FILTER
  // =====================================================

  selectedFilter: NotificationFilter = 'all';

  searchText = '';

  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage = 1;

  pageLimit = 10;

  totalRecords = 0;

  totalPages = 0;

  hasNextPage = false;

  // =====================================================
  // STATE
  // =====================================================

  unreadCount = 0;

  isLoading = false;

  constructor(
    private apiService: ApiService,

    public commonService: CommonService,

    private dialogRef: MatDialogRef<NotificationComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    const currentUser = this.commonService.getCurrentUserDetails();

    this.EmployeeNo = currentUser?.empNo || '';

    this.unreadCount = this.data?.unreadCount || 0;

    /*
     * Use notifications already loaded by
     * sidenav for instant UI.
     */

    if (this.data?.notifications?.length) {
      this.notifications = [...this.data.notifications];

      this.applyFilters();
    }

    /*
     * Then fetch complete list from API.
     */

    this.loadNotifications(true);
  }

  // =====================================================
  // GET NOTIFICATIONS
  // =====================================================

  loadNotifications(reset = false): void {
    if (!this.EmployeeNo) {
      return;
    }

    if (reset) {
      this.currentPage = 1;

      this.notifications = [];
    }

    this.isLoading = true;

    const payload: any = {
      empNo: this.EmployeeNo,

      page: this.currentPage,

      limit: this.pageLimit,
    };

    /*
     * Backend filtering
     */

    if (this.selectedFilter === 'unread') {
      payload.isRead = false;
    }

    if (this.selectedFilter === 'read') {
      payload.isRead = true;
    }

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_NOTIFICATIONS, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.status !== 'success') {
            return;
          }

          const data = res.data || {};

          const newNotifications: Notification[] = data.notifications || [];

          /*
           * Prevent duplicates when
           * loading more pages.
           */

          if (reset) {
            this.notifications = newNotifications;
          } else {
            const existingIds = new Set(
              this.notifications.map((item) => item._id),
            );

            const unique = newNotifications.filter(
              (item) => !existingIds.has(item._id),
            );

            this.notifications = [...this.notifications, ...unique];
          }

          this.totalRecords = data.pagination?.totalRecords || 0;

          this.totalPages = data.pagination?.totalPages || 0;

          this.hasNextPage = data.pagination?.hasNextPage || false;

          this.unreadCount = data.unreadCount || 0;

          this.applyFilters();
        },

        error: (error) => {
          console.error('Notification API Error:', error);
        },

        complete: () => {
          this.isLoading = false;
        },
      });
  }

  // =====================================================
  // LOAD MORE
  // =====================================================

  loadMore(): void {
    if (this.isLoading || !this.hasNextPage) {
      return;
    }

    this.currentPage++;

    this.loadNotifications(false);
  }

  // =====================================================
  // FILTER
  // =====================================================

  changeFilter(filter: NotificationFilter): void {
    if (this.selectedFilter === filter) {
      return;
    }

    this.selectedFilter = filter;

    this.currentPage = 1;

    this.notifications = [];

    this.loadNotifications(true);
  }

  // =====================================================
  // SEARCH
  // =====================================================

  applyFilters(): void {
    let result = [...this.notifications];

    /*
     * Local search
     */

    const search = this.searchText.trim().toLowerCase();

    if (search) {
      result = result.filter((notification) => {
        return (
          notification.title?.toLowerCase().includes(search) ||
          notification.message?.toLowerCase().includes(search) ||
          notification.module?.toLowerCase().includes(search) ||
          notification.event?.toLowerCase().includes(search)
        );
      });
    }

    /*
     * Filter locally as well.
     * Useful when initial data is passed.
     */

    if (this.selectedFilter === 'unread') {
      result = result.filter((item) => !item.isRead);
    }

    if (this.selectedFilter === 'read') {
      result = result.filter((item) => item.isRead);
    }

    this.displayedNotifications = result;
  }

  clearSearch(): void {
    this.searchText = '';

    this.applyFilters();
  }

  resetFilters(): void {
    this.searchText = '';

    this.selectedFilter = 'all';

    this.currentPage = 1;

    this.notifications = [];

    this.loadNotifications(true);
  }

  // =====================================================
  // MARK SINGLE READ
  // =====================================================

  openNotification(notification: Notification): void {
    if (!notification.isRead) {
      this.markNotificationAsRead(notification);
    }

    /*
     * Close dialog and send
     * route to parent.
     */

    if (notification.route) {
      this.dialogRef.close({
        route: notification.route,
      });

      return;
    }
  }

  markNotificationAsRead(notification: Notification): void {
    if (!notification._id || notification.isRead) {
      return;
    }

    const payload = {
      notificationId: notification._id,

      empNo: this.EmployeeNo,
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_MARK_READ_NOTIFICATIONS, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.status !== 'success') {
            return;
          }

          notification.isRead = true;

          notification.readAt =
            res?.data?.notification?.readAt || new Date().toISOString();

          this.unreadCount = Math.max(this.unreadCount - 1, 0);

          /*
           * Update shared state
           */

          this.commonService.setNotifications(this.notifications);

          this.commonService.setUnreadCount(this.unreadCount);

          this.applyFilters();
        },

        error: (error) => {
          console.error('Mark notification read error:', error);
        },
      });
  }

  // =====================================================
  // MARK ALL READ
  // =====================================================

  markAllRead(): void {
    if (!this.EmployeeNo || this.unreadCount === 0) {
      return;
    }

    const payload = {
      empNo: this.EmployeeNo,
    };

    this.isLoading = true;

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_MARK_ALL_READ_NOTIFICATIONS, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.status !== 'success') {
            return;
          }

          this.notifications = this.notifications.map((item) => ({
            ...item,

            isRead: true,

            readAt: new Date().toISOString(),
          }));

          this.unreadCount = 0;

          this.commonService.setNotifications(this.notifications);

          this.commonService.setUnreadCount(0);

          this.applyFilters();
        },

        error: (error) => {
          console.error('Mark all read error:', error);
        },

        complete: () => {
          this.isLoading = false;
        },
      });
  }

  // =====================================================
  // FILTER LABEL
  // =====================================================

  get selectedFilterLabel(): string {
    switch (this.selectedFilter) {
      case 'unread':
        return 'Unread';

      case 'read':
        return 'Read';

      default:
        return 'All';
    }
  }

  // =====================================================
  // EVENT FORMAT
  // =====================================================

  formatEvent(event: string): string {
    if (!event) {
      return '';
    }

    return event
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // =====================================================
  // ICON BACKGROUND
  // =====================================================

  getIconBackground(color: string): string {
    if (!color) {
      return '#eef5ff';
    }

    /*
     * Convert #2196F3
     * to transparent-ish background.
     */

    if (color.startsWith('#') && color.length === 7) {
      const r = parseInt(color.substring(1, 3), 16);

      const g = parseInt(color.substring(3, 5), 16);

      const b = parseInt(color.substring(5, 7), 16);

      return `rgba(${r}, ${g}, ${b}, 0.10)`;
    }

    return '#eef5ff';
  }

  // =====================================================
  // TIME
  // =====================================================

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

  // =====================================================
  // TRACK BY
  // =====================================================

  trackByNotification(index: number, item: Notification): string {
    return item._id;
  }

  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
