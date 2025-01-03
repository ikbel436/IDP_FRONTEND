import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, NgModule, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { TranslocoService } from '@ngneat/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, FormsModule, RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass],
})
export class ProfileComponent implements OnInit {
  ctx = {};
  formFieldHelpers: string[] = [''];
  fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  user: User; // Initialize with the user's data
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  description: string
  images: string;
  title = 'fileUpload';
  Fonction: string;
  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder, private userService: UserService, private _httpClient: HttpClient, private cdRef: ChangeDetectorRef) {
  }
  currentUser: User = {
    name: '',
    email: '',
    image: '',
    phoneNumber: '',
    password: '',
    countryCode: '',

    status: '',
    description: '',
    id: '',
    role: '',
    birthDate: undefined,
    codePostal: undefined,
    country: undefined,
    city: undefined,
    createdAt: undefined
  };
  user$: Observable<User>;
  imageUrl: string;
  ngOnInit(): void {

    this.userService.get().subscribe(
      user => {
        //console.log('User fetched:', user);
        this.currentUser = user;

        if (this.currentUser && this.currentUser.image) {
          const transformedUrl = this.currentUser.image.replace('/upload/', '/upload/w_128,h_128,c_fill/');
          this.imageUrl = transformedUrl;
          //console.log(this.imageUrl); // Check if URL is logged
        }
      },
      error => {
        console.error('Error fetching current user:', error);
      }
    );
    this.user$ = this.userService.get();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // getUserData(user: User): void {
  //   // this.userService.get().subscribe(
  //   //   (response) => {
  //   // this.user = response;
  //   // Initialize form fields with old values
  //   this.name = user.name;
  //   this.email = user.email;
  //   this.phoneNumber = user.phoneNumber;
  //   this.description = user.description;
  //   this.Fonction = user.Fonction;
  //   // console.error(this.ctx);

  //   //   },

  //   //   (error) => {
  //   //     console.error('Error fetching user data:', error);
  //   //   }
  //   // );
  // }
  updateUserInfo(): void {
    // Prepare updated user object
    // const updatedUser = {
    //   name: this.name,
    //   email: this.email,
    //   phoneNumber: this.phoneNumber,
    //   description: this.description,
    //   Fonction: this.Fonction,

    // };
    const updatedUser = this.currentUser;

    // Call the service method to update user info
    this.userService.update(updatedUser).subscribe(
      (response) => {
        // console.log('User updated successfully:', response);
        // this.getUserData(response);
        this.currentUser = response
        window.location.reload();
      },
      (error) => {
        console.error('Error updating user:', error);

      }
    );
  }
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getUserData(): void {
    this.userService.get().subscribe(
      (response) => {
        this.user = response;
        // Initialize form fields with old values
        this.name = this.user.name;
        this.email = this.user.email;
        this.phoneNumber = this.user.phoneNumber;
        this.countryCode = this.user.countryCode;
        this.description = this.user.description;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  // updateUserInfo(): void {
  //     // Prepare updated user object
  //     const updatedUser = {
  //         name: this.name,
  //         email: this.email,
  //         phoneNumber: this.phoneNumber,
  //         description: this.description,
  //     };

  //     // Call the service method to update user info
  //     this.userService.update(updatedUser).subscribe(
  //         (response) => {
  //             console.log('User updated successfully:', response);
  //             this.getUserData();
  //             this.currentUser = response;
  //             window.location.reload();
  //         },
  //         (error) => {
  //             console.error('Error updating user:', error);
  //         }
  //     );
  // }
  // selectImage(event) {
  //     if (event.target.files.length > 0) {
  //         const file = event.target.files[0];
  //         this.images = file;
  //     }
  // }
  selectedImage: any;
  selectImage1(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  getUserID(): string {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.id;
    } else {
      console.error('Token not found in local storage.');
      return null;
    }
  }
  onSubmit() {
    const userId = this.getUserID();
    const formData = new FormData();
    formData.append('file', this.images);

    this._httpClient
      .put<any>(`https://backend.idp.insparkconnect.com/auth/upload/${userId}`, formData)
      .subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
  }
  onFileSelected(files: FileList): void {
    if (files.length > 0) {
      const file = files[0];
      this.userService.uploadImage(file).subscribe(
        (response) => {
          //console.log('Image uploaded successfully:', response);
          // Handle success (if needed)
        },
        (error) => {
          console.error('Error uploading image:', error);
          // Handle error (if needed)
        }
      );
    }
  }

  /**
   * Get the form field helpers as string
   */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }
}
