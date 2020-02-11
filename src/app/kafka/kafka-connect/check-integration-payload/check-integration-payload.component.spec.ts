import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckPayloadComponent} from './check-integration-payload.component';

describe('CheckPayloadComponent', () => {
  let component: CheckPayloadComponent;
  let fixture: ComponentFixture<CheckPayloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPayloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPayloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
