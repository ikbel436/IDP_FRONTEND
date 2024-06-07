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


  cloudServices: CloudService[] = [];
  uniqueProviders: string[] = [];
  selectedProvider: string | null = null;
  userRole: string;
  filteredCloudServices: CloudService[] = [];

  displayedColumns: string[] = [];

  constructor(private cloudServiceService: CloudServiceService) { }

  ngOnInit(): void {
    this.userRole = this.getUserRole(); // Get user role from localStorage
    this.setDisplayedColumns();
    this.fetchCloudServices();
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') ?? '';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }

  setDisplayedColumns(): void {
    this.displayedColumns = ['TYPE', 'PROVIDER', 'SERVICE_NAME', 'LOCATION'];
    if (this.isAdmin()) {
      this.displayedColumns.push('AVAILABILITY');
    }
    if (this.isUser()) {
      this.displayedColumns.push('ADD_SERVICE');
    }
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

  addService(service: CloudService): void {
    // Implement logic to add the service for the user
    console.log('Service added for user:', service);
  }

  getProviderLogo(provider: string): string {
    const logos: { [key: string]: string } = {
      'AWS': 'assets/images/logo/aws.png',
      'Azure': 'assets/images/logo/azure.png',
      'GCP': 'assets/images/logo/gcp.png',
      'Oracle Cloud': 'assets/images/logo/oracle.png',
      'IBM': 'assets/images/logo/ibm.png'
    };
    return logos[provider] || '';
  }
}
