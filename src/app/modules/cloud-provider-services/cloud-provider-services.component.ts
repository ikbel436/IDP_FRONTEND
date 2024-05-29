import { Component, OnInit } from '@angular/core';
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CloudProviderServicesService } from 'app/core/services/cloud-provider-services.service';


@Component({
  selector: 'app-cloud-provider-services',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    NgIf,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    NgFor,
    NgTemplateOutlet,
    MatPaginatorModule,
    NgClass,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    AsyncPipe,
    CurrencyPipe,
  ],
  templateUrl: './cloud-provider-services.component.html',
  styleUrl: './cloud-provider-services.component.scss'
})
export class CloudProviderServicesComponent implements OnInit {
  displayedColumns: string[] = [
    'TYPE',
    'RESOURCE GROUP',
    'LOCATION',
  ];

  resources: any[] = [];
  errorMessage: string = '';

  constructor(private azureResourcesService: CloudProviderServicesService) { }

  ngOnInit(): void {
    this.fetchResources();
  }

  fetchResources(): void {
    this.azureResourcesService.getResources().subscribe(
      (data) => {
        this.resources = data;
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

}
