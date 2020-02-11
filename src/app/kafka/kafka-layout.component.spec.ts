import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaLayoutComponent } from './kafka-layout.component';

describe('KafkaLayoutComponent', () => {
  let component: KafkaLayoutComponent;
  let fixture: ComponentFixture<KafkaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
