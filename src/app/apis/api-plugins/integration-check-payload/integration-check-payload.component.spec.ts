import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IntegrationCheckPayloadComponent} from './integration-check-payload.component';

describe('IntegrationCheckPayloadComponent', () => {
  let component: IntegrationCheckPayloadComponent;
  let fixture: ComponentFixture<IntegrationCheckPayloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationCheckPayloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationCheckPayloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
