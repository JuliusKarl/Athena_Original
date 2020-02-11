import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaConnectorsComponent } from './kafka-connectors.component';

describe('KafkaConnectorsComponent', () => {
  let component: KafkaConnectorsComponent;
  let fixture: ComponentFixture<KafkaConnectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaConnectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaConnectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
