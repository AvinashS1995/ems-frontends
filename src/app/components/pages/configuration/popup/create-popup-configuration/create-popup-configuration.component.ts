import { Component } from '@angular/core';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';

@Component({
  selector: 'app-create-popup-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './create-popup-configuration.component.html',
  styleUrl: './create-popup-configuration.component.scss',
})
export class CreatePopupConfigurationComponent {
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

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareCreatePopupConfigForm();
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      this.createPopupConfigForm.patchValue({ file });
    } else {
      alert('File exceeds 5MB limit!');
    }
  }

  onSubmitPopupConfigForm(): void {
    if (this.createPopupConfigForm.valid) {
      console.log('Form Submitted:', this.createPopupConfigForm.value);
      // send to backend
    }
  }

  cancelForm(): void {
    this.createPopupConfigForm.reset({ isActive: true, popupType: 'text' });
  }

  uploadFile(form: FormGroup, controlName: string, event: Event): void {
    
      const input = event.target as HTMLInputElement;
debugger
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
}
