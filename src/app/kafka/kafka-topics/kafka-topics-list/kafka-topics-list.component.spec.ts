import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaTopicsListComponent } from './kafka-topics-list.component';

describe('KafkaTopicsListComponent', () => {
  let component: KafkaTopicsListComponent;
  let fixture: ComponentFixture<KafkaTopicsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaTopicsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaTopicsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
