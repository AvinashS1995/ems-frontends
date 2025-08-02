import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
})
export class TaskManagementComponent {
  taskColumns = [
    'id',
    'name',
    'status',
    'startDate',
    'dueDate',
    'assignedTo',
    'tags',
    'priority',
    'action',
  ];

  taskList = [
    {
      id: 1,
      name: 'MPS-redesign',
      status: 'Not Started',
      startDate: '30 June 2024',
      dueDate: '25 July 2024',
      assignedTo: ['assets/user1.png', 'assets/user2.png'],
      tags: 'Bug',
      priority: 'Low',
    },
    {
      id: 2,
      name: 'Fractional Ownership (Lo-Fi)',
      status: 'Awaiting Feedback',
      startDate: '13 June 2024',
      dueDate: '29 June 2024',
      assignedTo: ['assets/user3.png'],
      tags: 'Design',
      priority: 'High',
    },
    {
      id: 3,
      name: 'B2B Lead',
      status: 'Testing',
      startDate: '28 May 2024',
      dueDate: '28 June 2024',
      assignedTo: ['assets/user1.png', 'assets/user2.png', 'assets/user3.png'],
      tags: 'Bug',
      priority: 'High',
    },
    {
      id: 4,
      name: 'Brand Guidelines - NTS',
      status: 'In progress',
      startDate: '28 May 2024',
      dueDate: '28 June 2024',
      assignedTo: ['assets/user2.png', 'assets/user3.png'],
      tags: 'Development',
      priority: 'High',
    },
    {
      id: 5,
      name: 'AutoX',
      status: 'Testing',
      startDate: '12 April 2024',
      dueDate: '26 June 2024',
      assignedTo: [
        'assets/user1.png',
        'assets/user2.png',
        'assets/user3.png',
        'assets/user4.png',
      ],
      tags: 'Bug',
      priority: 'High',
    },
  ];

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s/g, '-');
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Not Started':
        return 'error';
      case 'Awaiting Feedback':
        return 'schedule';
      case 'In progress':
        return 'download';
      case 'Testing':
        return 'check_circle';
      default:
        return 'info';
    }
  }

  editProject(element: any) {}

  deleteProject(element: any) {}
}
