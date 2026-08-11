import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastRecords } from './past-records';

describe('PastRecords', () => {
  let component: PastRecords;
  let fixture: ComponentFixture<PastRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastRecords],
    }).compileComponents();

    fixture = TestBed.createComponent(PastRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
