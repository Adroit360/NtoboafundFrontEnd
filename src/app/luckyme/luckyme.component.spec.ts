import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckymeComponent } from './luckyme.component';

describe('LuckymeComponent', () => {
  let component: LuckymeComponent;
  let fixture: ComponentFixture<LuckymeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuckymeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
