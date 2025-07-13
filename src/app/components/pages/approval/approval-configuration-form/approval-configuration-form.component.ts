import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import {
  Category,
  RequestType,
  Role,
} from '../../../../shared/interface/approval';

@Component({
  selector: 'app-approval-configuration-form',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './approval-configuration-form.component.html',
  styleUrl: './approval-configuration-form.component.scss',
})
export class ApprovalConfigurationFormComponent {
  private destroy$ = new Subject<void>();

  createApprovalConfigurationForm!: FormGroup;
  requestTypeList: RequestType[] = [];
  roles: Role[] = [];
  categories: Category[] = [];

  isEditMode = false;
  selectedRequestType: RequestType | null = null;
  hierarchyRoles: Role[] = [];
  id: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareCreateApprovalConfigurationForm();
    this.getparams();
  }

  prepareCreateApprovalConfigurationForm() {
    this.createApprovalConfigurationForm = new FormGroup({
      request: new FormControl(''),
    });
  }

  getparams() {
    this.activateRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        console.log('PARAMS--->', params);

        if (params['data']) {
          debugger;
          this.requestTypeList = params['data']?.requestType?.data?.types || [];
          this.requestTypeList = this.requestTypeList.map(
            (requestType: any) => {
              return {
                value: requestType.typeValue,
                label: requestType.typeLabel,
              };
            }
          );

          this.roles = params['data'].roles?.data?.types || [];
          this.buildCategories(this.roles);
          console.log('Category Roles--->', this.roles);

          const approvalDetails = params['data']?.approvalDetails;

          if (approvalDetails?.mode === 'edit' && approvalDetails?.data) {
            this.isEditMode = true;

            const approvalData = approvalDetails.data;

            this.id = approvalData._id;

            const matchedRequestType = this.requestTypeList.find(
              (item) =>
                item.label === approvalData.typeName ||
                item.value == approvalData.type
            );

            if (matchedRequestType) {
              this.selectedRequestType = matchedRequestType;
              this.createApprovalConfigurationForm.patchValue({
                request: matchedRequestType.label,
              });
            }

            const existingHierarchy =
              approvalData.listApprovalFlowDetails || [];

            this.hierarchyRoles = existingHierarchy
              .map((entry: any) =>
                this.roles.find((role) => role.typeLabel === entry.role)
              )
              .filter(Boolean) as Role[];
          }
        }
      });
  }

  private buildCategories(roles: Role[]): void {
    const grouped: { [key: string]: Role[] } = {};

    for (const role of roles) {
      const dept = role.departmentType || 'Others';
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push(role);
    }

    this.categories = Object.entries(grouped).map(([name, roles]) => ({
      name,
      expanded: false,
      roles,
    }));
    console.log(this.categories);
  }

  onRequestTypeSelect(value: RequestType): void {
    this.selectedRequestType = value;
    if (!this.isEditMode) {
      this.hierarchyRoles = [];
    }
  }

  toggleExpand(category: Category): void {
    category.expanded = !category.expanded;
  }

  addToHierarchy(role: Role): void {
    if (!this.hierarchyRoles.some((r) => r.typeValue === role.typeValue)) {
      this.hierarchyRoles.push(role);
    }
  }

  removeFromHierarchy(index: number): void {
    this.hierarchyRoles.splice(index, 1);
  }

  drop(event: CdkDragDrop<Role[]>): void {
    moveItemInArray(
      this.hierarchyRoles,
      event.previousIndex,
      event.currentIndex
    );
  }

  onSubmitApprovalConfigurationForm() {
    if (!this.selectedRequestType || this.hierarchyRoles.length === 0) return;

    const payload = {
      id: this.isEditMode ? this.id : '',
      type: this.selectedRequestType.value || '',
      typeName: this.selectedRequestType.label || '',
      listApprovalFlowDetails:
        this.hierarchyRoles.map((role, index) => ({
          role: role.typeLabel,
          sequenceNo: index + 1,
        })) || [],
    };

    console.log('Final Payload:', payload);

    const ENDPOINT = this.isEditMode
      ? API_ENDPOINTS.SERVICE_UPDATE_APPROVAL_CONFIGURATION_DETAILS
      : API_ENDPOINTS.SERVICE_SAVE_APPROVAL_CONFIGURATION_DETAILS;

    this.apiService.postApiCall(ENDPOINT, payload).subscribe({
      next: (res: any) => {
        console.log(`${ENDPOINT} Response : `, res);

        this.commonService.openSnackbar(res.message, 'success');
        this.router.navigate(['/approval-configuration-list']);
      },
      error: (error) => {
        this.commonService.openSnackbar(error.error.message, 'error');
      },
    });
  }

  cancelForm() {
    this.router.navigate(['/approval-configuration-list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
