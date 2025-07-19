import { Component, Inject } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {

  scale = 1;
  rotation = 0;
  flipH = false;
  flipV = false;
  imageSrc: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filename: string, imageUrl: string },
    private sanitizer: DomSanitizer
  ) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(data.imageUrl);
  }

  zoomIn() { 
    this.scale += 0.1; 
  }

  zoomOut() { 
    this.scale = Math.max(0.1, this.scale - 0.1); 
  }

  rotateLeft() { 
    this.rotation -= 90; 
  }

  rotateRight() { 
    this.rotation += 90; 
  }

  flipHorizontal() { 
    this.flipH = !this.flipH; 
  }

  flipVertical() { 
    this.flipV = !this.flipV; 
  }

  close() { 
    this.dialogRef.close(); 
  }

  getTransform(): string {
    const scaleX = this.flipH ? -this.scale : this.scale;
    const scaleY = this.flipV ? -this.scale : this.scale;
    return `rotate(${this.rotation}deg) scale(${scaleX}, ${scaleY})`;
  }
  
}
