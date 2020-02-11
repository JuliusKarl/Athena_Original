import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiBoxPortsComponent } from './api-box-ports.component';

describe('ApiBoxPortsComponent', () => {
  let component: ApiBoxPortsComponent;
  let fixture: ComponentFixture<ApiBoxPortsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiBoxPortsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiBoxPortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
