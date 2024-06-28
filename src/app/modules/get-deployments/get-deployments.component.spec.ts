import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDeploymentsComponent } from './get-deployments.component';

describe('GetDeploymentsComponent', () => {
  let component: GetDeploymentsComponent;
  let fixture: ComponentFixture<GetDeploymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDeploymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetDeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
