import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyScreen } from './daily-screen';

describe('DailyScreen', () => {
  let component: DailyScreen;
  let fixture: ComponentFixture<DailyScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
