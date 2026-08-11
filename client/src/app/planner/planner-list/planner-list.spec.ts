import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerList } from './planner-list';

describe('PlannerList', () => {
  let component: PlannerList;
  let fixture: ComponentFixture<PlannerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerList],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
