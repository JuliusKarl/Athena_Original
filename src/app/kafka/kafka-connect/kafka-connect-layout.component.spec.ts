import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaConnectLayoutComponent } from './kafka-connect-layout.component';

describe('KafkaConnectLayoutComponent', () => {
  let component: KafkaConnectLayoutComponent;
  let fixture: ComponentFixture<KafkaConnectLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaConnectLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaConnectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
