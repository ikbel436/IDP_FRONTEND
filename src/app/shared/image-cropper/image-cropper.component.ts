import { ChangeDetectionStrategy, Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Dimensions, ImageCroppedEvent, ImageCropperModule, ImageTransform } from 'ngx-image-cropper';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImageCropperModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    MatProgressSpinnerModule,
    MatSliderModule,
  ],
  templateUrl: './image-cropper.component.html',
  styles: [
    `
      .image-cropper-container img {
        object-fit: contain;
        width: 600px;
        height: 600px;
      }

      @media (max-width: 600px) {
        .image-cropper-container img {
          width: 100%;
          height: auto;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  scale = 1;
  aspectRatio = 4 / 3;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {
    translateUnit: 'px',
  };
  loading = false;
  allowMoveImage = false;
  hidden = false;
  value = 0;

  private toastService = inject(HotToastService);

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    private _translocoService: TranslocoService
  ) {}

  imageCropped(event: ImageCroppedEvent) {
    // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    // event.blob can be used to upload the cropped image
    this.croppedImage = event.blob;
  }

  fileChangeEvent(event: any): void {
    const file: File = event.target.files[0];

    if (file.size > 8000000) {
      this.toastService.warning(this._translocoService.translate('error.fileUpload.maxSize'), {
        dismissible: true,
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.toastService.warning(this._translocoService.translate('error.fileUpload.invalidImgFormat'), {
        dismissible: true,
      });
      return;
    }
    this.loading = true;
    this.imageChangedEvent = event;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    this.loading = false;
  }

  loadImageFailed() {
    console.error('Load image failed');
  }

  zoom(zoomLevel) {
    this.scale = zoomLevel;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  toggleAspectRatio() {
    this.aspectRatio = this.aspectRatio === 4 / 3 ? 16 / 5 : 4 / 3;
  }

  save() {
    this.dialogRef.close(this.croppedImage);
  }

  close() {
    this.dialogRef.close();
  }
}
