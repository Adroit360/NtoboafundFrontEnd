import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdbusinessesComponent } from './adbusinesses.component';

describe('AdbusinessesComponent', () => {
  let component: AdbusinessesComponent;
  let fixture: ComponentFixture<AdbusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdbusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdbusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
