import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTerraformComponent } from './template-terraform.component';

describe('TemplateTerraformComponent', () => {
  let component: TemplateTerraformComponent;
  let fixture: ComponentFixture<TemplateTerraformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateTerraformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateTerraformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
