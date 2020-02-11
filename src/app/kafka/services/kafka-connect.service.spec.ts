import { TestBed, inject } from '@angular/core/testing';

import { KafkaConnectService } from './kafka-connect.service';

describe('KafkaConnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KafkaConnectService]
    });
  });

  it('should be created', inject([KafkaConnectService], (service: KafkaConnectService) => {
    expect(service).toBeTruthy();
  }));
});
