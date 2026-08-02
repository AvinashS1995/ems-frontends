import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  searchText = '';

  filterType = 'all';

  notifications = [
    {
      id: 1,
      title: 'Leave Approved',
      message: 'Your leave request has been approved.',
      time: '2 min ago',
      icon: 'event_available',
      color: '#4CAF50',
      isRead: false,
    },

    {
      id: 2,
      title: 'Attendance Reminder',
      message: 'You forgot to checkout today.',
      time: '20 min ago',
      icon: 'schedule',
      color: '#FF9800',
      isRead: false,
    },

    {
      id: 3,
      title: 'Payroll Generated',
      message: 'Salary credited successfully.',
      time: 'Yesterday',
      icon: 'payments',
      color: '#2196F3',
      isRead: true,
    },

    {
      id: 4,
      title: 'Meeting Reminder',
      message: 'Daily Scrum starts in 15 minutes.',
      time: 'Today',
      icon: 'groups',
      color: '#9C27B0',
      isRead: false,
    },
  ];

  filteredNotifications = [...this.notifications];

  filterNotifications() {
    this.filteredNotifications = this.notifications.filter((x) => {
      const search =
        x.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        x.message.toLowerCase().includes(this.searchText.toLowerCase());

      const status =
        this.filterType === 'all'
          ? true
          : this.filterType === 'read'
            ? x.isRead
            : !x.isRead;

      return search && status;
    });
  }

  markRead(item: any) {
    item.isRead = true;

    this.filterNotifications();
  }

  markAllRead() {
    this.notifications.forEach((x) => (x.isRead = true));

    this.filterNotifications();
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter((x) => x.id !== id);

    this.filterNotifications();
  }
}
