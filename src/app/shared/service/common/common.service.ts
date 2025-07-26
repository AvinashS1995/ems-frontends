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
import { DocumentViewerComponent } from '../../widget/dialog/document-viewer/document-viewer.component';
import { ImageViewerComponent } from '../../widget/dialog/image-viewer/image-viewer.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  expandSidenav = signal<boolean>(true);

  userDetails: UserDetails = {
    _id: '',
    empNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    mobile: '',
    address: '',
    country: '',
    role: '',
    type: '',
    status: '',
    reportedBy: '',
    designation: '',
    department: '',
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

  showAlertDialog(data: AlertDialogData): Observable<any> {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '650px',
      disableClose: true,
      data: {
        title: data.title,
        message: data.message,
        okText: data.okText || 'OK',
      },
    });

    return dialogRef.afterClosed();
  }

  viewImageViewer(filename?: string, imageUrl?: string) {
   return this.dialog.open(ImageViewerComponent, {
      data: { filename, imageUrl },
      width: '95vw',
      height: '95vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      disableClose: true,
    });
  }

  viewDocumentViewer(filename?: string, fileUrl?: string) {
   return this.dialog.open(DocumentViewerComponent, {
      data: { filename, fileUrl },
      width: '95vw',
      height: '95vh',
      disableClose: true,
      panelClass: 'pdf-viewer-dialog',
    });
  }

  returnFilenameExtension(filepath: string): string | null {
    if (!filepath || typeof filepath !== 'string') {
      return null;
    }

    const sanitizedPath = filepath.split('?')[0];
    const segments = sanitizedPath.split('/');
    const filename = segments[segments.length - 1];
    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
      return null;
    }

    return filename.substring(lastDotIndex + 1).toLowerCase();
  }

  onViewDocument(filename?: string, fileUrl?: any): void {
    const extension = this.returnFilenameExtension(fileUrl);

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

    if (extension && imageExtensions.includes(extension)) {
      this.viewImageViewer(filename, fileUrl);
    } else {
      this.viewDocumentViewer(filename, fileUrl);
    }
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
