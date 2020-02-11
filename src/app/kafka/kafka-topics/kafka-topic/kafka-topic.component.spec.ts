import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaTopicComponent } from './kafka-topic.component';

describe('KafkaTopicComponent', () => {
  let component: KafkaTopicComponent;
  let fixture: ComponentFixture<KafkaTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
