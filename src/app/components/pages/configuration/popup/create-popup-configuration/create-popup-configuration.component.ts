import { Component } from '@angular/core';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';
import { Subject } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}

@Component({
  selector: 'app-create-popup-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './create-popup-configuration.component.html',
  styleUrl: './create-popup-configuration.component.scss',
  providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    ],
})
export class CreatePopupConfigurationComponent {
  private destroy$ = new Subject<void>();

  createPopupConfigForm!: FormGroup;

  countryList = [{ label: 'India' }, { label: 'USA' }, { label: 'Germany' }];

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
          country: this.popdetails.country || '',
          role: this.popdetails.role || '',
          employee: this.popdetails.employee || '',
          gender: this.popdetails.gender || '',
          popupType: this.popdetails.popupType || '',
          textInput: this.popdetails.textMessage || '',
          file: this.popdetails.uploadedFile || '',
          isActive: this.popdetails.isActive || '',
        });
        console.log(this.allEmployeeList)
       
        this.popupDetailID = this.popdetails._id;

        this.uploadFileDocumentName =
          this.popdetails.uploadedFile?.split('?')[0]?.split('/').pop() || '';
        console.log(this.uploadFileDocumentName);
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
        payload.uploadedFile =
          formValue.file?.split('?')[0]?.split('/').pop() || '';
      }

      console.log(payload);

      const ENDPOINT = this.editMode
        ? API_ENDPOINTS.SERVICE_UPDATE_POPUP_DETAILS
        : API_ENDPOINTS.SERVICE_SAVE_POPUP_DETAILS;

      this.apiService.postApiCall(ENDPOINT, payload).subscribe({
        next: (res: any) => {
          console.log(`${ENDPOINT} Response : `, res);

          this.commonService.openSnackbar(res.message, 'success');
          this.router.navigateByUrl('/popup-configuration');
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
