import {
    CurrencyPipe,
    NgClass,
    NgFor,
    NgIf,
    CommonModule,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { UserService } from 'app/core/user/user.service';
import { ProfileService } from 'app/core/user/profile.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProfileUpdateDialogComponent } from '../profile-update-dialog/profile-update-dialog.component';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { User } from 'app/core/user/user.types';

import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        CommonModule,
        LanguagesComponent,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        LanguagesComponent,

        UserComponent,
        RouterModule,
        TranslocoModule,
    ],
})
export class ProfileComponent {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];

    formFieldHelpers: string[] = [''];
    fixedSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    //user: any;
    user: User; // Initialize with the user's data
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    images;
    user$: Observable<User>;
    title = 'fileUpload';
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private userService: UserService,
        private _httpClient: HttpClient
    ) {}
    currentUser: any;
    ngOnInit(): void {
        this.user$ = this.userService.user$;
        this.userService.get().subscribe(
            (user) => {
                this.currentUser = user;
                // this.fetchImage(this.currentUser?.image);
                this.getUserData(); // Fetch user data after currentUser is set
            },
            (error) => {
                console.error('Error fetching current user:', error);
            }
        );
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
                this.description = this.user.description;
            },
            (error) => {
                console.error('Error fetching user data:', error);
            }
        );
    }
    updateUserInfo(): void {
        // Prepare updated user object
        const updatedUser = {
            name: this.name,
            email: this.email,
            phoneNumber: this.phoneNumber,
            description: this.description,
        };

        // Call the service method to update user info
        this.userService.update(updatedUser).subscribe(
            (response) => {
                console.log('User updated successfully:', response);
                this.getUserData();
                this.currentUser = response;
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
            .put<any>(`http://localhost:3000/auth/upload/${userId}`, formData)
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
                    console.log('Image uploaded successfully:', response);
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
