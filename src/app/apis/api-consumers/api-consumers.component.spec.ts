import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConsumersComponent } from './api-consumers.component';

describe('ApiConsumersComponent', () => {
  let component: ApiConsumersComponent;
  let fixture: ComponentFixture<ApiConsumersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiConsumersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConsumersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
