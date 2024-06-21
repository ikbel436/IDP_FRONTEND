import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseHighlightComponent } from '@fuse/components/highlight';

import { CommonModule } from '@angular/common';
import { TerraformService } from '@fuse/services/terraform/terraform.service';
import { ToastService } from 'app/services/toast.service';
@Component({
  selector: 'app-config-infra',
  standalone: true,
  imports: [MatIconModule, FormsModule,FuseHighlightComponent, CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],

  templateUrl: './config-infra.component.html',
  styleUrl: './config-infra.component.scss'
})
export class ConfigInfraComponent {
  horizontalStepperForm: UntypedFormGroup;
  verticalStepperForm: UntypedFormGroup;
  showEc2Config = false;
  showS3Config = false;

  regionValue = 'ca-central-1';
  amis = [
    { label: 'Amazon Linux 2023 AMI', value: 'ami-07117708253546063' },
    { label: 'Canonical, Ubuntu, 24.04 LTS, amd64 noble image build on 2024-04-23', value: 'ami-0c4596ce1e7ae3e68' },
    { label: 'Debian 12 (20231013-1532)', value: 'ami-0713c39dce6526131' },
    { label: ' Red Hat Enterprise Linux 9 (HVM), SSD Volume Type', value: 'ami-0d270005f18b0539a' },
    { label: ' Amazon Linux 2 with : .NET 6, Mono 6.12, PowerShell 7, and MATE DE pre-installed to run your .NET applications ', value: 'ami-0fdd2bb78451114e8' },



    // Add more AMIs as needed
  ];

  instanceTypes = [
    { label: 't2.micro', value: 't2.micro' },
    { label: 't2.nano', value: 't2.nano' },
    // Add more instance types as needed
  ];
  /**
    * Constructor
    */
  constructor(private _formBuilder: UntypedFormBuilder, private _httpClient: HttpClient, private terraformService: TerraformService,private _toastService: ToastService,
  ) {
  }
  ngOnInit(): void {
    // Horizontal stepper form
    this.horizontalStepperForm = this._formBuilder.group({

      step1: this._formBuilder.group({
        ec2Selected: [false],
        s3Selected: [false]
      }),
      step2: this._formBuilder.group({
        ami: ['', Validators.required],
        instance_type: ['', Validators.required],
        name: ['', Validators.required]
      }),
      step3: this._formBuilder.group({
        names3: ['']

      }),
    });


  }
  // -----------------------------------------------------------------------------------------------------
  //@ Small Functions 
  // -----------------------------------------------------------------------------------------------------

    lowercaseValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    // Check if the value is not empty and is in lowercase
    if (value &&!/^[a-z]+$/.test(value)) {
      return {'lowercase': true};
    }
    return null;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this._toastService.createSuccessToast(
        'The Terraform configuration has been copied to the clipboard.'
      );    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  }


  generateJsonConfiguration(): string {
    const step2Data = this.horizontalStepperForm.get('step2').value;
    const step1Data = this.horizontalStepperForm.get('step1').value;
    const step3Data = this.horizontalStepperForm.get('step3').value; 
  
    let config = {
      provider: "aws",
      region: step2Data.region,
      profile: "default",
      resources: []
    };
  
    if (step1Data.ec2Selected) {
      config.resources.push({
        resourceType: `"aws_instance" "${step2Data.name}"`,
        name: step2Data.name,
        ami: step2Data.ami,
        instanceType: step2Data.instance_type,
        keyName: "2024key",
        tags: {
         Terraform   : "true",
          Environment : "dev"
        }
      });
    }
  
    if (step1Data.s3Selected) {
      config.resources.push({
        resourceType: `"${step3Data.names3}" , "aws_s3_bucket_policy"`,
        name: step3Data.names3,
        bucket: "aws_s3_bucket",
        policy:"{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PrivateContent\",\"Effect\":\"Deny\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::string/*\"}]}"
      });
    }
    
    return JSON.stringify(config, null, 2);
  }
  


  onSubmit() {
    const step1Data = this.horizontalStepperForm.get('step1').value;
    const step2Data = this.horizontalStepperForm.get('step2').value;
    const step3Data = this.horizontalStepperForm.get('step3').value;
    const configs = {
      region: step2Data.region,
      ami: step2Data.ami,
      instance_type: step2Data.instance_type,
      name: step2Data.name,
      generateS3Module: step1Data.s3Selected,
      s3BucketName: step3Data.s3BucketName,
      ec2Instance: step1Data.ec2Selected
    };
    if (this.horizontalStepperForm.valid) {
      const formData = this.horizontalStepperForm.value;
      this.terraformService.generateTerraform(configs)
        .subscribe(
          (response) => {
            //console.log('Terraform configuration generated:', response);
            // Optionally, reset the form after successful submission
            this.horizontalStepperForm.reset();
          },
          (error) => {
            console.error('Error generating Terraform configuration:', error);
            // Handle error
          }
        );
    } else {
      // Mark all form fields as touched to display validation errors
      this.horizontalStepperForm.markAllAsTouched();
    }
  }


  

}

