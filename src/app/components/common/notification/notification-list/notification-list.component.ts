import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';

export interface Notification {
  id: string;

  title: string;

  message: string;

  type: string;

  module: string;

  referenceId: string;

  icon: string;

  color: string;

  isRead: boolean;

  createdAt: Date;
  timeAgo?: string;
}

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent {
  searchText = '';

  filterType: 'all' | 'read' | 'unread' = 'all';

  notifications: Notification[] = [];

  filteredNotifications: Notification[] = [];

  todayNotifications: Notification[] = [];

  yesterdayNotifications: Notification[] = [];

  earlierNotifications: Notification[] = [];

  loading = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;

    // Replace with API

    this.notifications = [
      {
        id: '1',
        title: 'Leave Approved',
        message: 'Your leave request has been approved.',
        type: 'Leave',
        module: 'Leave',
        referenceId: 'LV0001',
        icon: 'event_available',
        color: '#4CAF50',
        isRead: false,
        createdAt: new Date(),
      },

      {
        id: '2',
        title: 'Attendance Reminder',
        message: 'You forgot to checkout.',
        type: 'Attendance',
        module: 'Attendance',
        referenceId: 'AT001',
        icon: 'schedule',
        color: '#FF9800',
        isRead: false,
        createdAt: new Date(),
      },

      {
        id: '3',
        title: 'Payroll Generated',
        message: 'Salary generated successfully.',
        type: 'Payroll',
        module: 'Payroll',
        referenceId: 'PAY001',
        icon: 'payments',
        color: '#1976d2',
        isRead: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    ];

    this.notifications = this.notifications.map((item) => ({
      ...item,
      timeAgo: this.getTimeAgo(item.createdAt),
    }));

    this.filterNotifications();

    this.loading = false;
  }

  filterNotifications() {
    let data = [...this.notifications];

    // Search

    if (this.searchText) {
      data = data.filter(
        (x) =>
          x.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          x.message.toLowerCase().includes(this.searchText.toLowerCase()),
      );
    }

    // Status Filter

    switch (this.filterType) {
      case 'read':
        data = data.filter((x) => x.isRead);

        break;

      case 'unread':
        data = data.filter((x) => !x.isRead);

        break;
    }

    this.filteredNotifications = data;

    this.groupNotifications();
  }

  groupNotifications() {
    this.todayNotifications = [];

    this.yesterdayNotifications = [];

    this.earlierNotifications = [];

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    this.filteredNotifications.forEach((item) => {
      if (this.isSameDay(item.createdAt, today)) {
        this.todayNotifications.push(item);
      } else if (this.isSameDay(item.createdAt, yesterday)) {
        this.yesterdayNotifications.push(item);
      } else {
        this.earlierNotifications.push(item);
      }
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() == date2.getDate() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getFullYear() == date2.getFullYear()
    );
  }

  markRead(notification: Notification) {
    notification.isRead = true;

    // TODO

    // API Call

    this.filterNotifications();
  }

  markAllRead() {
    this.notifications.forEach((x) => (x.isRead = true));

    // TODO API

    this.filterNotifications();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter((x) => x.id !== id);

    // TODO API

    this.filterNotifications();
  }

  clearAll() {
    this.notifications = [];

    this.filterNotifications();
  }

  openNotification(notification: Notification) {
    notification.isRead = true;

    switch (notification.module) {
      case 'Leave':
        // this.router.navigate(['/leave-details',notification.referenceId]);

        break;

      case 'Attendance':
        // this.router.navigate(['/attendance']);

        break;

      case 'Payroll':
        // this.router.navigate(['/payroll']);

        break;
    }
  }

  get unreadCount() {
    return this.notifications.filter((x) => !x.isRead).length;
  }

  getTimeAgo(date: string | Date): string {
    const now = new Date().getTime();
    const notificationTime = new Date(date).getTime();

    const seconds = Math.floor((now - notificationTime) / 1000);

    if (seconds < 60) {
      return 'Just now';
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return 'Yesterday';
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
