import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { StorageService } from '../../../shared/service/common/storage.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { ApiService } from '../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { KeyService } from '../../../shared/service/common/key.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService,
    private storageService: StorageService,
    private keyService: KeyService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      // password: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD_REGEX)]]
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onLoginSubmit() {
    console.log(this.loginForm);
    let { rememberMe } = this.loginForm.getRawValue();
    if (this.loginForm.valid) {
      this.apiService.authApiCall(
        API_ENDPOINTS.SERVICE_LOGIN,
        this.loginForm.value
      ).subscribe({
        next: (resp: any) => {
          console.log(`${API_ENDPOINTS.SERVICE_LOGIN} Response : `, resp);
          if (resp.token && resp.secretKey) {
            

            const storage = rememberMe ? 'local' : 'session';

            this.storageService.setItem('token', resp.token, storage);
            this.storageService.setItem('role', resp.user.role, storage);
            // this.storageService.setEncrypted('key', resp.secretKey, storage);
            this.commonService.setUserDetailsFromToken();
            this.keyService.setKey(this.commonService.userDetails.loginUserSecretkey);
            this.commonService.openSnackbar(resp.message, 'success');
            // this.commonService.setUserDetails(resp.user.name, resp.user.role);
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    }
  }

  onForgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
}
