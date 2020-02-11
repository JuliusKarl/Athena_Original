import {inject, TestBed} from '@angular/core/testing';

import {SpringbootStarterService} from './springboot-starter.service';

describe('SpringbootStarterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpringbootStarterService]
    });
  });

  it('should be created', inject([SpringbootStarterService], (service: SpringbootStarterService) => {
    expect(service).toBeTruthy();
  }));
});
