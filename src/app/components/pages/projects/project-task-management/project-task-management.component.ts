import { Component } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

@Component({
  selector: 'app-project-task-management',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './project-task-management.component.html',
  styleUrl: './project-task-management.component.scss',
})
export class ProjectTaskManagementComponent {
  employeeProjectTaskFilterForm!: FormGroup;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'teamLeader',
    'timeline',
  ];

  projects: Array<any> = [];

  tasks: Array<any> = [];
  userInfo: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInfo = this.commonService.getCurrentUserDetails();
    this.prepareEmployeeProjectTaskForm();
    this.applyFilters();
  }

  prepareEmployeeProjectTaskForm() {
    this.employeeProjectTaskFilterForm = this.fb.group({
      name: [''],
    });
    this.roleWiseShowDisplayedColumn(this.userInfo.role);
  }

  updateTaskStatus(task: any, newStatus: string) {
    task.status = newStatus;

    if (newStatus === 'Completed') {
      if (!this.displayedColumns.includes('upload')) {
        this.displayedColumns = [...this.displayedColumns, 'upload'];
      }
    } else {
      if (this.displayedColumns.includes('upload')) {
        this.displayedColumns = this.displayedColumns.filter(
          (col) => col !== 'upload'
        );
      }
    }

    if (this.userInfo.role === 'Employee') {
      const payload = {
        projectId: task.projectId || '',
        taskId: task.taskId,
        status: newStatus,
        updatedBy: {
          empNo: this.userInfo.empNo,
          name: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
          role: this.userInfo.role,
        },
      };

      console.log(payload);

      this.apiService
        .postApiCall(
          API_ENDPOINTS.SERVICE_UPDATE_TASKS_STATUSBYPROJECTS,
          payload
        )
        .subscribe({
          next: (res: any) => {
            console.log('Task status updated:', res);
            this.commonService.openSnackbar(res.message, 'success');
          },
          error: (error: any) => {
            this.commonService.openSnackbar(error.error.message, 'error');
            console.error(error);
          },
        });
    }
  }

  uploadFiles(event: any, task: any) {
    const files = Array.from(event.target.files).map((f: any) => f.name);
    task.files = [...(task.files || []), ...files];

    this.submitCompletedTask(task);
  }

  submitCompletedTask(task: any) {
    console.log('Submitting task with files:', task);
  }

  applyFilters() {
    const payload = {
      empNo: this.commonService.getCurrentUserDetails().empNo || '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_PROJETS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(`${API_ENDPOINTS.SERVICE_GET_PROJETS} Response : `, res);

          if (this.userInfo.role === 'Manager') {
            this.projects = res.data.projects || [];
            console.log('projects----->', this.projects);
          } else {
            this.tasks = (res.data.projects || []).flatMap(
              (proj: any) => proj.tasks || []
            );
            console.log('tasks---->', this.tasks);
          }

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }
  clearFilters() {}

  CreateTask() {
    this.router.navigateByUrl('/create-project-task');
  }

  roleWiseShowDisplayedColumn(role: string) {
    switch (this.userInfo.role) {
      case 'Manager':
        this.displayedColumns = [
          'id',
          'name',
          'description',
          'teamLeader',
          'timeline',
        ];
        break;

      case 'Team Leader':
        this.displayedColumns = [
          'projectId',
          'taskName',
          'taskdescription',
          'employee',
          'role',
          'dueDate',
          'status',
        ];
        break;

      case 'Employee':
        this.displayedColumns = [
          'projectId',
          'taskName',
          'taskdescription',
          'employee',
          'role',
          'dueDate',
          'status',
        ];
        break;
    }
  }
}
