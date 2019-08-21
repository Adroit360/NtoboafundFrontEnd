import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdscholarshipComponent } from './adscholarship.component';

describe('AdscholarshipComponent', () => {
  let component: AdscholarshipComponent;
  let fixture: ComponentFixture<AdscholarshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdscholarshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdscholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
