import {inject, TestBed} from '@angular/core/testing';

import {BitbucketService} from './bitbucket.service';

describe('BitbucketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BitbucketService]
    });
  });

  it('should be created', inject([BitbucketService], (service: BitbucketService) => {
    expect(service).toBeTruthy();
  }));
});
