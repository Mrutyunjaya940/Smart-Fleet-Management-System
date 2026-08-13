import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelManagement } from './fuel-management';

describe('FuelManagement', () => {
  let component: FuelManagement;
  let fixture: ComponentFixture<FuelManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(FuelManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
