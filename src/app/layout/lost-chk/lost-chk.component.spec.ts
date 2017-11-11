import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostChkComponent } from './lost-chk.component';

describe('LostChkComponent', () => {
  let component: LostChkComponent;
  let fixture: ComponentFixture<LostChkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostChkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostChkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
