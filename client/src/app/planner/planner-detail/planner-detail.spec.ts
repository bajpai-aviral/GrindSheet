import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerDetail } from './planner-detail';

describe('PlannerDetail', () => {
  let component: PlannerDetail;
  let fixture: ComponentFixture<PlannerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
