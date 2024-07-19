import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentStatsComponent } from './deployment-stats.component';

describe('DeploymentStatsComponent', () => {
  let component: DeploymentStatsComponent;
  let fixture: ComponentFixture<DeploymentStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeploymentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
