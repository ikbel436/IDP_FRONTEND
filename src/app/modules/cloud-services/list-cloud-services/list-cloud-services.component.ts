import { Component, OnInit } from '@angular/core';
import { CloudService } from 'app/models/cloud-service.types';
import { CloudServiceService } from 'app/services/cloud-service.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';

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

@Component({
  selector: 'app-list-cloud-services',
  templateUrl: './list-cloud-services.component.html',
  styleUrls: ['./list-cloud-services.component.scss'],
  imports: [CommonModule,
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
    CurrencyPipe,],
  standalone: true,
})
export class ListCloudServicesComponent implements OnInit {
  displayedColumns: string[] = [
    'provider',
    'serviceName',
    'serviceType',
    'location',
    'availability'
  ];

  cloudServices: CloudService[] = [];
  uniqueProviders: string[] = [];
  selectedProvider: string | null = null;

  constructor(private cloudServiceService: CloudServiceService) { }

  ngOnInit(): void {
    this.fetchCloudServices();
  }

  fetchCloudServices(): void {
    this.cloudServiceService.getCloudServices().subscribe(cloudServices => {
      this.cloudServices = cloudServices;
      // Extract unique provider names for filter dropdown
      this.uniqueProviders = Array.from(new Set(cloudServices.map(service => service.provider)));
      // If a provider is already selected, filter services for that provider
      if (this.selectedProvider) {
        this.filterServicesByProvider();
      }
    });
  }

  onProviderSelected(): void {
    // Filter services when provider selection changes
    if (this.selectedProvider) {
      this.filterServicesByProvider();
    } else {
      // If no provider selected, fetch all services again
      this.fetchCloudServices();
    }
  }

  filterServicesByProvider(): void {
    // Filter services based on selected provider
    this.cloudServices = this.cloudServices.filter(service => service.provider === this.selectedProvider);
  }

  /*fetchCloudServices(): void {
    this.cloudServiceService.getCloudServices().subscribe(cloudServices => {
      this.cloudServices = cloudServices;
    });
  }*/

  toggleAvailability(service: CloudService): void {
    // Toggle the availability of the service and update it on the server
    service.available = !service.available;
    this.cloudServiceService.updateServiceAvailability(service).subscribe(updatedService => {
      // Handle success or error response if needed
    });
  }
}
