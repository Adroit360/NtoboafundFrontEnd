import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordformComponent } from './resetpasswordform.component';

describe('ResetpasswordformComponent', () => {
  let component: ResetpasswordformComponent;
  let fixture: ComponentFixture<ResetpasswordformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswordformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
