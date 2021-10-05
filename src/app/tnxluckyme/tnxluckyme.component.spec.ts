import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TnxluckymeComponent } from './tnxluckyme.component';

describe('TnxluckymeComponent', () => {
  let component: TnxluckymeComponent;
  let fixture: ComponentFixture<TnxluckymeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TnxluckymeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TnxluckymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
