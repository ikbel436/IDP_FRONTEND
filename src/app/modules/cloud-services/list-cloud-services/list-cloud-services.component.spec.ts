import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCloudServicesComponent } from './list-cloud-services.component';

describe('ListCloudServicesComponent', () => {
  let component: ListCloudServicesComponent;
  let fixture: ComponentFixture<ListCloudServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCloudServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCloudServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
