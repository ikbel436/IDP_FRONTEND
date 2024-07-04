import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPushImageComponent } from './build-push-image.component';

describe('BuildPushImageComponent', () => {
  let component: BuildPushImageComponent;
  let fixture: ComponentFixture<BuildPushImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildPushImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildPushImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
