import { Component, Inject } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../../service/common/common.service';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss'
})
export class DocumentViewerComponent {

  safePdfUrl: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<DocumentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileUrl: string; filename?: string },
    private sanitizer: DomSanitizer
  ) {
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.fileUrl);
  }

  close(): void {
    this.dialogRef.close();
  }
  
}
