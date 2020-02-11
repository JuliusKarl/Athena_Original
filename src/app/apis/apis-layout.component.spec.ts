import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApisLayoutComponent } from './apis-layout.component';

describe('EventsHomeComponent', () => {
  let component: ApisLayoutComponent;
  let fixture: ComponentFixture<ApisLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApisLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApisLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
