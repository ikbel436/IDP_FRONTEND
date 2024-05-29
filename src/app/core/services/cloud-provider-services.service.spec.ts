import { TestBed } from '@angular/core/testing';

import { CloudProviderServicesService } from './cloud-provider-services.service';

describe('CloudProviderServicesService', () => {
  let service: CloudProviderServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudProviderServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
