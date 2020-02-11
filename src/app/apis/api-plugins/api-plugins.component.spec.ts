import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPluginsComponent } from './api-plugins.component';

describe('ApiPluginsComponent', () => {
  let component: ApiPluginsComponent;
  let fixture: ComponentFixture<ApiPluginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiPluginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
