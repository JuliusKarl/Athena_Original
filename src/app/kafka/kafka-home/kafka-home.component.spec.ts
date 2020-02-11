import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaHomeComponent } from './kafka-home.component';

describe('KafkaHomeComponent', () => {
  let component: KafkaHomeComponent;
  let fixture: ComponentFixture<KafkaHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
