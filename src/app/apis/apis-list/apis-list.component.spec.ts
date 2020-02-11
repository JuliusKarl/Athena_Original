import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApisListComponent } from './apis-list.component';

describe('ApisListComponent', () => {
  let component: ApisListComponent;
  let fixture: ComponentFixture<ApisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
