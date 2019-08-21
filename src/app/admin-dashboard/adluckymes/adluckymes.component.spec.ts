import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdluckymesComponent } from './adluckymes.component';

describe('AdluckymesComponent', () => {
  let component: AdluckymesComponent;
  let fixture: ComponentFixture<AdluckymesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdluckymesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdluckymesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
