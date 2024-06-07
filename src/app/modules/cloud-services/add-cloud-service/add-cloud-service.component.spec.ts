import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCloudServiceComponent } from './add-cloud-service.component';

describe('AddCloudServiceComponent', () => {
  let component: AddCloudServiceComponent;
  let fixture: ComponentFixture<AddCloudServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCloudServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCloudServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
