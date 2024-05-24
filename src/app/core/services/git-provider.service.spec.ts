import { TestBed } from '@angular/core/testing';

import { GitProviderService } from './git-provider.service';

describe('GitProviderService', () => {
  let service: GitProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
