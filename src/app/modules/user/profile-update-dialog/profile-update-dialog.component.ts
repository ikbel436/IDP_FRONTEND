import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ProfileService } from 'app/core/user/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-update-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDividerModule, MatCheckboxModule, MatRadioModule, MatButtonModule],

  templateUrl: './profile-update-dialog.component.html',
  styleUrl: './profile-update-dialog.component.scss'
})
export class ProfileUpdateDialogComponent {
  // userId: string; // Initialize with the user's ID
  user: any; // Initialize with the user's data

  name: string;
  description: string;
  lien: string;
  provider: string;

  constructor(

    public dialogRef: MatDialogRef<ProfileUpdateDialogComponent>,
    private userService: UserService,
    private projectService: ProfileService, private router: Router
  ) { }
  ngOnInit(): void {
    // Fetch user data when the component initializes
    // const userId = localStorage.getItem('id');// Assign the user's ID
    //  this.getUserData();
  }
  createProject(): void {
    this.projectService.createProject(this.name, this.description, this.provider, this.lien)
      .subscribe(
        response => {
          console.log('Project created successfully:', response);
          this.router.navigateByUrl('/dashboards/project');
        },
        error => {
          console.error('Error creating project:', error);
          // Gérer l'erreur
        }
      );
  }
}
