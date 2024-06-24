import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CIPipelinesComponent } from './ci-pipelines.component';

describe('CIPipelinesComponent', () => {
  let component: CIPipelinesComponent;
  let fixture: ComponentFixture<CIPipelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CIPipelinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CIPipelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
