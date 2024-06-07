import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule, } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CloudServiceService } from 'app/services/cloud-service.service';
import { CloudService } from 'app/models/cloud-service.types';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-add-cloud-service',
  standalone: true,
  imports: [MatProgressBarModule, ReactiveFormsModule, NgClass, HttpClientModule, CommonModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, MatInputModule, MatSelectModule, MatOptionModule, MatDividerModule, MatCheckboxModule, MatRadioModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './add-cloud-service.component.html',
  styleUrl: './add-cloud-service.component.scss'
})
export class AddCloudServiceComponent implements OnInit {

  cloudServiceForm: FormGroup;

  constructor(private fb: FormBuilder, private cloudServiceService: CloudServiceService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.cloudServiceForm = this.fb.group({
      provider: ['', Validators.required],
      serviceName: ['', Validators.required],
      serviceType: ['', Validators.required],
      location: ['', Validators.required],
      available: [true]
    });
  }

  onSubmit() {
    if (this.cloudServiceForm.invalid) {
      return;
    }
    const formData = this.cloudServiceForm.value;
    this.cloudServiceService.addCloudService(formData).subscribe(response => {
      //console.log('Cloud service added:', response);
      this.cloudServiceForm.reset();
    });
  }

}
