import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { NgClass, NgIf } from '@angular/common';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
  selector: 'app-logged-in-home',
  standalone: true,
  imports: [MatButtonModule, FuseCardComponent, RouterLink, MatIconModule, MatExpansionModule, MatFormFieldModule, MatInputModule, NgIf, NgClass],
  templateUrl: './logged-in-home.component.html',
  styleUrl: './logged-in-home.component.scss'
})
export class LoggedInHomeComponent {

}
