import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './past-records.html',
  styleUrl: './past-records.scss'
})
export class PastRecords implements OnInit {

  record: PastRecordResponse | null = null;
  isLoading = false;
  selectedDate: Date = new Date();
  maxDate: Date = new Date();
  hasSearched = false;

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Set default to last week same day
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    this.selectedDate = lastWeek;
  }

  loadRecord(): void {
    const dateStr = this.workoutService.formatDate(this.selectedDate);
    this.isLoading = true;
    this.hasSearched = true;
    this.record = null;

    this.workoutService.getPastRecord(dateStr).subscribe({
      next: (record) => {
        this.record = record;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (err.status === 400 || err.status === 404) {
          this.snackBar.open(
            'No workout log found for this date',
            'Close',
            { duration: 3000 }
          );
        } else {
          this.snackBar.open(
            err.error?.error || 'Failed to load record',
            'Close',
            { duration: 3000 }
          );
        }
      }
    });
  }

  getDisplayDate(): string {
    return this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/workout/compare']);
  }

  goToToday(): void {
    this.router.navigate(['/workout/today']);
  }
}