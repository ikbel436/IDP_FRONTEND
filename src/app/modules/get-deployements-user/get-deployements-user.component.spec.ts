import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDeployementsUserComponent } from './get-deployements-user.component';

describe('GetDeployementsUserComponent', () => {
  let component: GetDeployementsUserComponent;
  let fixture: ComponentFixture<GetDeployementsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDeployementsUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetDeployementsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
