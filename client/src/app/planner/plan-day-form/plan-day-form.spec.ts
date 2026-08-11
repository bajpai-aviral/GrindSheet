import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDayForm } from './plan-day-form';

describe('PlanDayForm', () => {
  let component: PlanDayForm;
  let fixture: ComponentFixture<PlanDayForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDayForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanDayForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
