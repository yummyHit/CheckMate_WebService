import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrprintComponent } from './qrprint.component';

describe('QrprintComponent', () => {
  let component: QrprintComponent;
  let fixture: ComponentFixture<QrprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
