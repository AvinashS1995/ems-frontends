import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { TaskManagementComponent } from '../task-management/task-management.component';
import { ReminderComponent } from '../reminder/reminder.component';
import { ProjectManagementComponent } from '../project-management/project-management.component';

@Component({
  selector: 'app-project-task-management',
  standalone: true,
  imports: [
    SHARED_MATERIAL_MODULES,
    TaskManagementComponent,
    ReminderComponent,
    ProjectManagementComponent,
  ],
  templateUrl: './project-task-management.component.html',
  styleUrl: './project-task-management.component.scss',
})
export class ProjectTaskManagementComponent {
  private destroy$ = new Subject<void>();

  employeeProjectTaskFilterForm!: FormGroup;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.prepareEmployeeProjectTaskForm();
  }

  prepareEmployeeProjectTaskForm() {
    this.employeeProjectTaskFilterForm = this.fb.group({
      name: [''],
    });
  }

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

  applyFilters() {}

  clearFilters() {}

  CreateTask() {}
}
