import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaConsumerComponent } from './kafka-consumer.component';

describe('KafkaConsumerComponent', () => {
  let component: KafkaConsumerComponent;
  let fixture: ComponentFixture<KafkaConsumerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaConsumerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
