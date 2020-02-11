import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetOffsetDialogComponent } from './reset-offset-dialog.component';

describe('ResetOffsetDialogComponent', () => {
  let component: ResetOffsetDialogComponent;
  let fixture: ComponentFixture<ResetOffsetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetOffsetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetOffsetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
