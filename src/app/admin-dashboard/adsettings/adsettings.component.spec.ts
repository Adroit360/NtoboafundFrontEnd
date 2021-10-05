import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsettingsComponent } from './adsettings.component';

describe('AdsettingsComponent', () => {
  let component: AdsettingsComponent;
  let fixture: ComponentFixture<AdsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
