import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaConsumersListComponent } from './kafka-consumers-list.component';

describe('KafkaConsumersListComponent', () => {
  let component: KafkaConsumersListComponent;
  let fixture: ComponentFixture<KafkaConsumersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaConsumersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaConsumersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
