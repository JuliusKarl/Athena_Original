import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaConnectSummaryComponent } from './kafka-connect-summary.component';

describe('KafkaConnectSummaryComponent', () => {
  let component: KafkaConnectSummaryComponent;
  let fixture: ComponentFixture<KafkaConnectSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaConnectSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaConnectSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
