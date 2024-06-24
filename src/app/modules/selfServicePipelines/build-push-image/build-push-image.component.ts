
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-build-push-image',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],
  templateUrl: './build-push-image.component.html',
  styleUrl: './build-push-image.component.scss'
})
export class BuildPushImageComponent implements OnInit {
  verticalStepperForm: UntypedFormGroup;


  /**
    * Constructor
    */
  constructor(private _formBuilder: UntypedFormBuilder) {
  }
  ngOnInit(): void {
    this.verticalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        country: ['', Validators.required],
        language: ['', Validators.required],
      }),
      step2: this._formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userName: ['', Validators.required],
        about: [''],
      }),
      step3: this._formBuilder.group({
        byEmail: this._formBuilder.group({
          companyNews: [true],
          featuredProducts: [false],
          messages: [true],
        }),
        pushNotifications: ['everything', Validators.required],
      }),
    });
  }

}
