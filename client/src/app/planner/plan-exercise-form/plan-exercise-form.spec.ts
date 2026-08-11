import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExerciseForm } from './plan-exercise-form';

describe('PlanExerciseForm', () => {
  let component: PlanExerciseForm;
  let fixture: ComponentFixture<PlanExerciseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanExerciseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanExerciseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
