import { Component, Inject } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss'
})
export class DocumentViewerComponent {

  safeUrl: SafeResourceUrl;
  fileExtension: string;

  constructor(
    public dialogRef: MatDialogRef<DocumentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileUrl: string; fileName?: string },
    private sanitizer: DomSanitizer
  ) {
    this.fileExtension = this.getFileExtension(data.fileUrl);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.buildViewerUrl(data.fileUrl));
  }

  private getFileExtension(url: string): string {
    return url.split('.').pop()?.toLowerCase() || '';
  }

  private buildViewerUrl(url: string): string {
    // For PDFs, hide toolbar/nav
    return this.getFileExtension(url) === 'pdf'
      ? `${url}#toolbar=0&navpanes=0&scrollbar=0`
      : url;
  }
}
