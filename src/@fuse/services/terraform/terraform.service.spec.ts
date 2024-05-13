import { TestBed } from '@angular/core/testing';

import { TerraformService } from './terraform.service';

describe('TerraformService', () => {
  let service: TerraformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerraformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
