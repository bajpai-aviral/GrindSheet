import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { WorkoutService } from '../workout';
import { PastRecordResponse } from '../../shared/models/workout.model';

@Component({
  selector: 'app-past-records',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './past-records.html',
  styleUrl: './past-records.scss'
})
export class PastRecords implements OnInit {

  record: PastRecordResponse | null = null;
  isLoading = false;
  selectedDateStr: string = '';
  maxDateStr: string = '';
  hasSearched = false;

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.maxDateStr = this.workoutService.formatDate(today);

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    this.selectedDateStr = this.workoutService.formatDate(lastWeek);
  }

  loadRecord(): void {
    if (!this.selectedDateStr) return;
    this.isLoading = true;
    this.hasSearched = true;
    this.record = null;

    this.workoutService.getPastRecord(this.selectedDateStr).subscribe({
      next: (record) => {
        this.record = record;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open(
          'No workout log found for this date',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  getDisplayDate(): string {
    if (!this.selectedDateStr) return '';
    const date = new Date(this.selectedDateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void { this.router.navigate(['/workout/compare']); }
  goToToday(): void { this.router.navigate(['/workout/today']); }
}