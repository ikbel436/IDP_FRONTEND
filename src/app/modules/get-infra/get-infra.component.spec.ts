import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInfraComponent } from './get-infra.component';

describe('GetInfraComponent', () => {
  let component: GetInfraComponent;
  let fixture: ComponentFixture<GetInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInfraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
