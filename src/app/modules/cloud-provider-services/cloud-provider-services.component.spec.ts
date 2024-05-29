import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudProviderServicesComponent } from './cloud-provider-services.component';

describe('CloudProviderServicesComponent', () => {
  let component: CloudProviderServicesComponent;
  let fixture: ComponentFixture<CloudProviderServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudProviderServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CloudProviderServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
