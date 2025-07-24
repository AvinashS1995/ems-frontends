import { Component } from '@angular/core';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-popup-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './create-popup-configuration.component.html',
  styleUrl: './create-popup-configuration.component.scss',
})
export class CreatePopupConfigurationComponent {
  private destroy$ = new Subject<void>();

  createPopupConfigForm!: FormGroup;

  countryList = [{ label: 'India' }, { label: 'USA' }, { label: 'Germany' }];

  employeeRoleList = [
    { label: 'Manager' },
    { label: 'Developer' },
    { label: 'HR' },
  ];

  employeeList = [
    { label: 'John Doe' },
    { label: 'Jane Smith' },
    { label: 'Rahul Sharma' },
  ];
  uploadFileDocumentName: any;
  uploadedUrl: any;
  editMode: boolean = false;
  popupDetailID: any;
  genderTypeList: Array<any> = [];
  allEmployeeList: Array<any> = [];
  roles: Array<any> = [];
  popdetails: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareCreatePopupConfigForm();
    this.getparam();
  }

  prepareCreatePopupConfigForm() {
    this.createPopupConfigForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: [''],
      endTime: [''],
      country: ['', Validators.required],
      role: ['', Validators.required],
      gender: ['', Validators.required],
      employee: ['', Validators.required],
      popupType: ['text'],
      textInput: [''],
      file: [null],
      isActive: [true],
    });

    this.onPopupTypeChange();
  }

  onPopupTypeChange(): void {
    this.createPopupConfigForm
      .get('popupType')
      ?.valueChanges.subscribe((type) => {
        if (type === 'text') {
          this.createPopupConfigForm
            .get('textInput')
            ?.setValidators([Validators.required]);
          this.createPopupConfigForm.get('file')?.clearValidators();
        } else {
          this.createPopupConfigForm
            .get('file')
            ?.setValidators([Validators.required]);
          this.createPopupConfigForm.get('textInput')?.clearValidators();
        }

        this.createPopupConfigForm.get('textInput')?.updateValueAndValidity();
        this.createPopupConfigForm.get('file')?.updateValueAndValidity();
      });
  }

  getparam() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.roles = params['data'].roles?.data?.types || [];
        this.roles = this.roles.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Roles--->', this.roles);

        this.genderTypeList = params['data'].genderType?.data?.types || [];
        this.genderTypeList = this.genderTypeList.map((genderType) => {
          return {
            value: genderType.typeValue,
            label: genderType.typeLabel,
          };
        });

        this.allEmployeeList =
          params['data'].getAllEmployee?.data?.userList || [];
        this.allEmployeeList = this.allEmployeeList.map((allEmployee) => {
          return {
            label: `${allEmployee.firstName} ${allEmployee.lastName} - [${allEmployee.empNo}]`,
            value: allEmployee.empNo,
          };
        });
      }

      this.popdetails = params['data'].popDetails;
debugger
      if (this.popdetails.mode === 'edit') {
        this.editMode = true;
        this.createPopupConfigForm.patchValue({
          name: this.popdetails.name || '',
          startDate: this.popdetails.startDate || '',
          endDate: this.popdetails.endDate || '',
          startTime: this.popdetails.startTime || '',
          endTime: this.popdetails.endTime || '',
          country: this.popdetails.country || "",
          role: this.popdetails.role || "",
          gender: this.popdetails.gender || "",
          employee: this.popdetails.name || "",
          popupType: this.popdetails.popupType || "",
          textInput: this.popdetails.textMessage || "",
          file: this.popdetails.uploadedFile || "",
          isActive: this.popdetails.isActive || "",
        });
      }
    });
  }

  onSubmitPopupConfigForm(): void {
    if (this.createPopupConfigForm.valid) {
      console.log('Form Submitted:', this.createPopupConfigForm.value);

      const formValue = this.createPopupConfigForm.value;

      const updateID = this.editMode ? this.popupDetailID : '';

      const payload: any = {
        id: updateID,
        name: formValue.name,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        country: formValue.country,
        role: formValue.role,
        gender: formValue.gender,
        employee: formValue.employee,
        popupType: formValue.popupType,
        isActive: formValue.isActive,
      };

      if (formValue.popupType === 'text') {
        payload.textMessage = formValue.textInput;
      }

      if (formValue.popupType === 'file') {
        payload.uploadedFile = formValue.file;
      }

      const ENDPOINT = this.editMode
        ? API_ENDPOINTS.SERVICE_UPDATE_POPUP_DETAILS
        : API_ENDPOINTS.SERVICE_SAVE_POPUP_DETAILS;

      this.apiService.postApiCall(ENDPOINT, payload).subscribe({
        next: (res: any) => {
          console.log(`${ENDPOINT} Response : `, res);

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    }
  }

  cancelForm(): void {
    this.router.navigateByUrl('/popup-configuration');
  }

  uploadFile(form: FormGroup, controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.commonService.openSnackbar('No file selected.', 'error');
      return;
    }

    const file = input.files[0];
    const allowedFileTypes = ['application/pdf'];

    if (!allowedFileTypes.includes(file.type)) {
      this.commonService.openSnackbar(
        'Only JPG, JPEG, and PNG, pdf files are allowed.',
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
          form.get(controlName)?.setValue(res?.data?.fileKey);
          this.uploadFileDocumentName = res?.data?.fileKey;
          this.uploadedUrl = res?.data?.presignFileUrl;

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  onViewDocument(filepath?: any, filename?: string) {
    if (filename !== '' || this.uploadedUrl) {
      if (filepath) {
        this.commonService.onViewDocument(filename, this.uploadedUrl);
      } else {
        this.commonService.openSnackbar(
          'No image available to preview',
          'error'
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
