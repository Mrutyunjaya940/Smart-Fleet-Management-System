import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverDialog } from './add-driver-dialog';

describe('AddDriverDialog', () => {
  let component: AddDriverDialog;
  let fixture: ComponentFixture<AddDriverDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDriverDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDriverDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
