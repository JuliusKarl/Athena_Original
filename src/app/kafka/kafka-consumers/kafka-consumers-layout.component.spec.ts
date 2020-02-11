import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KafkaConsumersLayoutComponent} from './kafka-consumers-layout.component';

describe('KafkaConsumersLayoutComponent', () => {
  let component: KafkaConsumersLayoutComponent;
  let fixture: ComponentFixture<KafkaConsumersLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaConsumersLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaConsumersLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
