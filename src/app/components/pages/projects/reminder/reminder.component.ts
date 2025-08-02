import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';

@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss',
})
export class ReminderComponent {
  reminderColumns = ['id', 'name', 'description', 'deadline', 'action'];

  reminderList = [
    {
      id: 1,
      name: 'NTS-redesign',
      description: 'Discussion on the project',
      deadline: '25 July 2024',
    },
    {
      id: 2,
      name: 'Fractional Ownership (Lo-Fi)',
      description: 'Project discussion',
      deadline: '29 June 2024',
    },
    {
      id: 3,
      name: 'B2B Lead',
      description: 'Discussion for the run time changes',
      deadline: '28 June 2024',
    },
    {
      id: 4,
      name: 'Brand Guidelines - NTS',
      description: 'Changes in the design',
      deadline: '28 June 2024',
    },
    {
      id: 5,
      name: 'AutoX',
      description: 'Discussion on the design changes',
      deadline: '26 June 2024',
    },
  ];

  editProject(element: any) {}

  deleteProject(element: any) {}
}
