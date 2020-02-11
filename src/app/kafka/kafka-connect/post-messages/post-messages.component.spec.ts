import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMessagesComponent } from './post-messages.component';

describe('PostMessagesComponent', () => {
  let component: PostMessagesComponent;
  let fixture: ComponentFixture<PostMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
