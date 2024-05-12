import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigInfraComponent } from './config-infra.component';

describe('ConfigInfraComponent', () => {
  let component: ConfigInfraComponent;
  let fixture: ComponentFixture<ConfigInfraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigInfraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigInfraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
