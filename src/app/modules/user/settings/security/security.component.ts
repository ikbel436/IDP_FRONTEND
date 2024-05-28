import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from 'app/core/auth/auth.service';




@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        CommonModule
    ],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder , private authservice : AuthService, ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: [''],
            newPassword: [''],
            twoStep: [true],
            askPasswordChange: [false],
        });

        
        
    }

    

   

    async changePassword() {
        const currentPassword = this.securityForm.controls.currentPassword.value;
        const newPassword = this.securityForm.controls.newPassword.value;
    
        try {
            const response = await this.authservice.changePassword({ currentPassword, newPassword }).toPromise();
            if (response) {
                // Handle success, e.g., show a success message
                alert('Password changed successfully!');
                
            } else {
                // Handle failure, e.g., show an error message
                alert('Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred while changing the password.');
        }
    }
}
