import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ProfileUpdateDialogComponent } from './profile-update-dialog/profile-update-dialog.component';




@NgModule({
  declarations: [ // Declare the components here
    ProfileComponent,
    ProfileUpdateDialogComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
