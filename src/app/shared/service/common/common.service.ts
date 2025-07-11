import { Injectable, signal } from '@angular/core';
import {
  AlertDialogData,
  ConfirmationDialogData,
} from '../../interface/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertDialogComponent } from '../../widget/dialog/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../../widget/dialog/confirmation-dialog/confirmation-dialog.component';
import { SnackBarComponent } from '../../widget/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { KeyService } from './key.service';
import { StorageService } from './storage.service';
import * as jwtDecodeNamespace from 'jwt-decode';
import { UserDetails } from '../../interface/user';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  expandSidenav = signal<boolean>(true);

  userDetails: UserDetails = {
    _id: '',
    empNo: '',
    name: '',
    email: '',
    mobile: '',
    role: '',
    type: '',
    status: '',
    teamLeader: '',
    manager: '',
    hr: '',
    designation: '',
    joiningDate: '',
    salary: 0,
    workType: '',
    profileImage: '',
    loginUserSecretkey: '',
  };

  private userDetailsSubject = new BehaviorSubject<UserDetails>(
    this.userDetails
  );

  userDetails$ = this.userDetailsSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageService,
    private keyService: KeyService
  ) {
    // this.setUserDetailsFromToken();
  }

  

  openSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, type },
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }

  showConfirmationDialog(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '650px',
      data: {
        title: data.title,
        message: data.message,
        confirmText: data.confirmText || 'Confirm',
        cancelText: data.cancelText || 'Cancel',
      },
    });

    return dialogRef.afterClosed();
  }

  showAlertDialog(data: AlertDialogData): Observable<void> {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '650px',
      data: {
        title: data.title,
        message: data.message,
        okText: data.okText || 'OK',
      },
    });

    return dialogRef.afterClosed();
  }

  setUserDetailsFromToken() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = this.storageService.getItem<string>('token', 'session');

      if (!token) {
        console.warn('Session and Token Is Expired');
      }

      if (token) {
        try {
          const decoded: any = jwtDecodeNamespace.jwtDecode(token);

          const secretKey =
            decoded.loginUserSecretKey || decoded.loginUserSecretkey || '';

          const updatedUser: UserDetails = {
            ...this.userDetails,
            ...decoded,
            loginUserSecretkey: secretKey,
          };

          this.userDetailsSubject.next(updatedUser);
          if (secretKey) {
            this.keyService.setKey(secretKey);
          }
        } catch (e) {
          console.error('JWT Decode failed:', e);
        }
      }
    }
  }

  getCurrentUserDetails() {
    return this.userDetailsSubject.value;
  }

  clearUserDetails(): void {
    this.userDetailsSubject.next(this.userDetails);
    this.keyService.clearKey();
  }
}
