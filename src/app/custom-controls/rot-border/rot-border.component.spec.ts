import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotBorderComponent } from './rot-border.component';

describe('RotBorderComponent', () => {
  let component: RotBorderComponent;
  let fixture: ComponentFixture<RotBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
