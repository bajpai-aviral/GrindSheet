import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerForm } from './planner-form';

describe('PlannerForm', () => {
  let component: PlannerForm;
  let fixture: ComponentFixture<PlannerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannerForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
