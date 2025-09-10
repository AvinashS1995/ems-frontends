import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { CommonService } from '../../../../shared/service/common/common.service';
import {
  MY_DATE_FORMATS,
  RoleCategory,
} from '../../../../shared/common/constant';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { ApiService } from '../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-project-task-management',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './create-project-task-management.component.html',
  styleUrl: './create-project-task-management.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CreateProjectTaskManagementComponent {
  role: 'Manager' | 'TeamLeader' = 'TeamLeader'; // demo
  createProjectTaskForm!: FormGroup;

  uploadFileDocumentName: any;
  uploadedUrl: any;

  descriptionLength = 0;
  isEditMode: Boolean = false;

  teamLeaders = ['John TL', 'Sara TL'];
  employees = ['Alice', 'Bob', 'Chris'];
  roles = ['Frontend Dev', 'Backend Dev', 'QA'];
  userInfo: any;
  assignToList: Array<any> = [];
  projectList: Array<any> = [];
  uploadFileDocumentPath: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.prepareCreateProjectTaskForm();
    if (
      this.userInfo.role === 'Team Leader' ||
      this.userInfo.role === 'Employee'
    ) {
      this.getparams();
    }
  }

  prepareCreateProjectTaskForm() {
    this.createProjectTaskForm = new FormGroup({});

    this.userInfo = this.commonService.getCurrentUserDetails();
    switch (Number(this.userInfo.roleId)) {
      case RoleCategory.MANAGER:
        let MGpayload = {
          add: {
            required: [
              'title',
              'description',
              'deadline',
              'attachments',
              'priority',
              'assignTo',
            ],
            optional: ['deliverables', 'milestones'],
          },
          remove: {
            data: ['projectId', 'expectedOutput', 'status'],
          },
        };
        this.addRemoveFormControl(MGpayload);
        break;

      case RoleCategory.TEAMLEADER:
        let TLpayload = {
          add: {
            required: [
              'projectId',
              'title',
              'description',
              'assignTo',
              'deadline',
              'priority',
              'attachments',
              'expectedOutput',
              'status',
            ],
            optional: ['deliverables', 'milestones'],
          },
          remove: { data: [] },
        };
        this.addRemoveFormControl(TLpayload);
        break;

      case RoleCategory.EMPLOYEE:
        let EMPpayload = {
          add: { required: [], optional: [] },
          remove: { data: [] },
        };
        this.addRemoveFormControl(EMPpayload);
        break;

      default:
        let defaultPayload = {
          add: {
            required: [
              'title',
              'description',
              'deadline',
              'attachments',
              'priority',
              'assignTo',
            ],
            optional: ['deliverables', 'milestones'],
          },
          remove: { data: [] },
        };
        this.addRemoveFormControl(defaultPayload);
        break;
    }
    this.loadAssignToOptions();
    console.log(this.createProjectTaskForm);
  }

  addRemoveFormControl(payload: {
    add: { required: string[]; optional: string[] };
    remove: { data: string[] };
  }) {
    // Add required controls
    payload.add.required.forEach((field) => {
      if (!this.createProjectTaskForm.contains(field)) {
        this.createProjectTaskForm.addControl(
          field,
          new FormControl(null, Validators.required)
        );
      }
    });

    // Add optional controls (no validators)
    payload.add.optional.forEach((field) => {
      if (!this.createProjectTaskForm.contains(field)) {
        this.createProjectTaskForm.addControl(field, new FormControl(null));
      }
    });

    // Remove controls
    payload.remove.data.forEach((field) => {
      if (this.createProjectTaskForm.contains(field)) {
        this.createProjectTaskForm.removeControl(field);
      }
    });
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.projectList = params['data'].getprojects?.data?.projects || [];
        this.projectList = this.projectList.map((projects) => {
          return {
            label: projects.title,
            value: projects.projectId,
          };
        });

        console.log('projectList--->', this.projectList);
      }
    });
  }

  updateDescriptionLength() {
    const value = this.createProjectTaskForm.get('projectDescription')?.value;
    this.descriptionLength = value?.length || 0;
  }

  uploadFile(form: FormGroup, controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.commonService.openSnackbar('No file selected.', 'error');
      return;
    }

    const file = input.files[0];
    const allowedFileTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml',
      'image/tiff',
    ];

    if (!allowedFileTypes.includes(file.type)) {
      this.commonService.openSnackbar(
        'Only PDF and image files are allowed (JPG, PNG, GIF, WebP, etc.)',
        'error'
      );
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.apiService
      .postFormDataApi(API_ENDPOINTS.SERVICE_UPLOADFILE, formData)
      .subscribe({
        next: (res) => {
          this.uploadFileDocumentName = res?.data?.fileKey;
          this.uploadFileDocumentPath = res?.data?.fileUrl;
          this.uploadedUrl = res?.data?.presignFileUrl;
          form.get(controlName)?.setValue(this.uploadedUrl);

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  onViewDocument(filepath?: any, filename?: string) {
    if ((filename !== '' && filepath) || this.uploadedUrl) {
      const url = filepath || this.uploadedUrl;
      if (filepath) {
        this.commonService.onViewDocument(filename, url);
      } else {
        this.commonService.openSnackbar(
          'No image available to preview',
          'error'
        );
      }
    }
  }

  loadAssignToOptions() {
    const payload = { empNo: this.userInfo.empNo };

    switch (Number(this.userInfo.roleId)) {
      case RoleCategory.MANAGER:
        this.loadTeamLeaders(payload);
        break;

      case RoleCategory.TEAMLEADER:
        this.loadEmployees(payload);
        break;

      default:
        this.assignToList = [];
        break;
    }
  }

  private loadTeamLeaders(payload: any) {
    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_MANAGER_WISE_TL, payload)
      .subscribe({
        next: (res: any) => {
          this.assignToList = res?.data?.formattedLeaders.map((tl: any) => ({
            empNo: tl.empNo,
            name: tl.name,
            designation: tl.designation,
            role: tl.role,
          }));

          console.log(this.assignToList);
        },
        error: (err) => {
          this.commonService.openSnackbar(err.error.message, 'error');
        },
      });
  }

  private loadEmployees(payload: any) {
    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_TL_WISE_EMPLOYEE, payload)
      .subscribe({
        next: (res: any) => {
          this.assignToList = res?.data?.formattedEmployees.map((emp: any) => ({
            empNo: emp.empNo,
            name: emp.name,
            designation: emp.designation,
            role: emp.role,
          }));
          console.log(this.assignToList);
        },
        error: (err) => {
          this.commonService.openSnackbar(err.error.message, 'error');
        },
      });
  }

  private mapFormToPayload(role: number, formValue: any): any {
    const assignTo = this.assignToList.find((emp) => formValue.assignTo);
    console.log(assignTo);
    switch (role) {
      case RoleCategory.MANAGER:
        return {
          title: formValue.title,
          description: formValue.description,
          deadline: formValue.deadline,
          attachments: formValue.attachments
            ? [
                {
                  fileUrl: this.uploadFileDocumentPath,
                  fileName: this.uploadFileDocumentName,
                },
              ]
            : [],
          priority: formValue.priority,
          deliverables: formValue.deliverables,
          milestones: formValue.milestones,
          createdBy: {
            empNo: this.userInfo.empNo,
            name: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
            role: this.userInfo.role,
          },
          assignTo: {
            empNo: assignTo.empNo,
            name: assignTo.name,
            designation: assignTo.designation,
            role: assignTo.role,
          },
        };

      case RoleCategory.TEAMLEADER:
        return {
          projectId: formValue.projectId,
          title: formValue.title,
          description: formValue.description,
          deadline: formValue.deadline,
          attachments: formValue.attachments
            ? [{ fileUrl: this.uploadFileDocumentName }]
            : [],
          priority: formValue.priority,
          expectedOutput: formValue.expectedOutput,
          deliverables: formValue.deliverables,
          milestones: formValue.milestones,
          status: formValue.status,
          assignTo: {
            empNo: assignTo.empNo,
            name: assignTo.name,
            designation: assignTo.designation,
            role: assignTo.role,
          },
          createdBy: {
            empNo: this.userInfo.empNo,
            name: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
            role: this.userInfo.role,
          },
        };

      default:
        return {};
    }
  }

  onCreateProjectTaskForm() {
    const formValue = this.createProjectTaskForm.value;
    const roleId = Number(this.userInfo.roleId);
    let apiEndpoint = '';

    switch (roleId) {
      case RoleCategory.MANAGER:
        apiEndpoint = API_ENDPOINTS.SERVICE_CREATE_NEW_PROJECT;
        break;
      case RoleCategory.TEAMLEADER:
        apiEndpoint = API_ENDPOINTS.SERVICE_CREATE_TASK;
        break;
      default:
        this.commonService.openSnackbar(
          'You are not authorized to create',
          'error'
        );
        return;
    }

    const payload = this.mapFormToPayload(roleId, formValue);

    console.log(`${this.userInfo.role}-${apiEndpoint}`, payload);

    this.apiService.postApiCall(apiEndpoint, payload).subscribe({
      next: (res: any) => {
        this.commonService.openSnackbar(res.message, 'success');
        this.createProjectTaskForm.reset();
        this.router.navigateByUrl('project-task-list');
      },
      error: (err: any) => {
        console.error(err);
        this.commonService.openSnackbar(err.error?.message, 'error');
      },
    });
  }

  cancelForm() {
    this.router.navigateByUrl('project-task-list');
  }
}
