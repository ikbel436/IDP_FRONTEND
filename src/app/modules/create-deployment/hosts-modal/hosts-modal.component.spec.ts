import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsModalComponent } from './hosts-modal.component';

describe('HostsModalComponent', () => {
  let component: HostsModalComponent;
  let fixture: ComponentFixture<HostsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
