import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartitionDataComponent } from './partition-data.component';

describe('PartitionDataComponent', () => {
  let component: PartitionDataComponent;
  let fixture: ComponentFixture<PartitionDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartitionDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartitionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
