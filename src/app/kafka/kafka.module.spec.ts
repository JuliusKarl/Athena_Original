import { KafkaModule } from './kafka.module';

describe('KafkaModule', () => {
  let kafkaModule: KafkaModule;

  beforeEach(() => {
    kafkaModule = new KafkaModule();
  });

  it('should create an instance', () => {
    expect(kafkaModule).toBeTruthy();
  });
});
