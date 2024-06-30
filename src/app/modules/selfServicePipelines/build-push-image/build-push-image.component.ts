
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WorkflowService } from './workflowService.service';
import { FuseHighlightComponent } from '@fuse/components/highlight';

@Component({
  selector: 'app-build-push-image',
  standalone: true,
  imports: [CommonModule, FuseHighlightComponent, MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule],
  templateUrl: './build-push-image.component.html',
  styleUrl: './build-push-image.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuildPushImageComponent implements OnInit {
  verticalStepperForm: UntypedFormGroup;
  @ViewChild('stepper') stepper: MatStepper;

  owner: string;
  token: string;
  repo: string;
  platform: string;
  yamlData: any;
  processMessage: string = '';
  workflowUrl: string;
  registryUrl: string;
  finalStep: boolean = false;



  /**
    * Constructor
    */
  constructor(private _formBuilder: UntypedFormBuilder,
    private workflowService: WorkflowService
  ) {
  }
  ngOnInit(): void {
    this.verticalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        //email: ['', [Validators.required, Validators.email]],
        package: ['', Validators.required],
        //language: ['', Validators.required],
      }),
      step2: this._formBuilder.group({
        branch: ['', Validators.required],
        yamlContent: [{ value: '', disabled: true }]
      }),
      step3: this._formBuilder.group({

        owner: ['', Validators.required],
        token: ['', Validators.required],
        repo: ['', Validators.required],
      }),
    });

    this.verticalStepperForm.get('step1.package').valueChanges.subscribe(value => {
      this.platform = value;
    });
  }

  updateYamlFile() {
    this.workflowService.updateYaml(this.owner, this.token, this.repo, this.platform, this.yamlData)
      .subscribe(response => {
        if (response.success) {
          console.log('YAML file updated successfully');
        }
      });
  }

  fetchYamlContent() {
    const platform = this.verticalStepperForm.get('step1.package').value;
    this.platform = platform;

    this.workflowService.readYaml(this.platform)
      .subscribe(response => {
        if (response) {
          this.yamlData = response;
          this.verticalStepperForm.get('step2.yamlContent').setValue(response);
        }
      }, error => {
        console.error('Error fetching YAML content:', error);
      });
  }


  updateYamlBranches() {
    const plat = this.verticalStepperForm.get('step1.package').value;
    const platform = plat;
    const branch = this.verticalStepperForm.get('step2.branch').value;
    const branches = [branch];

    this.workflowService.updateYamlBranches(platform, branches).subscribe(
      response => {
        console.log('YAML branches updated successfully:', response);
        this.fetchYamlContent(); // Fetch the updated YAML content
      },
      error => {
        console.error('Error updating YAML branches:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.verticalStepperForm.valid) {
      const formData = {
        owner: this.verticalStepperForm.get('step3.owner').value,
        token: this.verticalStepperForm.get('step3.token').value,
        repo: this.verticalStepperForm.get('step3.repo').value,
        platform: this.platform,
      };

      this.workflowService.pushWorkflowToGitHub(formData.owner, formData.token, formData.repo, formData.platform).subscribe(
        (response) => {
          this.workflowUrl = response.workflowUrl;
          this.registryUrl = response.registryUrl;
          this.processMessage = 'The workflow has been successfully pushed to GitHub. You can view the status of your workflow and access the Docker image in the GitHub Container Registry.';
          this.finalStep = true;
        },
        (error) => {
          console.error('Error:', error);
          this.processMessage = 'An error occurred while pushing the workflow. Please try again.';
          this.finalStep = true;
        }
      );
    }
  }

  onStepChange(event: any): void {
    if (event.selectedIndex === 1) { // 1 is the index of step2
      this.fetchYamlContent();
    }
  }
}
