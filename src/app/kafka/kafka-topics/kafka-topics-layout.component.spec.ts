import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaTopicsLayoutComponent } from './kafka-topics-layout.component';

describe('KafkaTopicsLayoutComponent', () => {
  let component: KafkaTopicsLayoutComponent;
  let fixture: ComponentFixture<KafkaTopicsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaTopicsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaTopicsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
