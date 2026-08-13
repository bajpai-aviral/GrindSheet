import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { WorkoutService } from '../workout';
import { CompareResponse, ExerciseCompareResponse, SetCompareResponse } from '../../shared/models/workout.model';

@Component({
  selector: 'app-compare',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './compare.html',
  styleUrl: './compare.scss'
})
export class Compare implements OnInit {

  comparison: CompareResponse | null = null;
  isLoading = true;
  today = '';
  displayDate = '';

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.today = this.workoutService.getTodayFormatted();
    this.displayDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.loadComparison();
  }

  loadComparison(): void {
    this.isLoading = true;
    this.workoutService.getComparison(this.today).subscribe({
      next: (comparison) => {
        this.comparison = comparison;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open(
          err.error?.error || 'Failed to load comparison',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }

  // Get difference label
  getDiffLabel(diff: number | null): string {
    if (diff === null || diff === undefined) return '';
    if (diff > 0) return `+${diff}kg ↑`;
    if (diff < 0) return `${diff}kg ↓`;
    return 'Same';
  }

  // Get difference class
  getDiffClass(diff: number | null): string {
    if (diff === null || diff === undefined) return '';
    if (diff > 0) return 'improved';
    if (diff < 0) return 'decreased';
    return 'same';
  }

  // Get compared to label
  getComparedToLabel(): string {
    if (!this.comparison?.comparedToDate) return 'No previous record';
    const weeks = this.comparison.weeksBack;
    return weeks === 1 ? 'Last week' : `${weeks} weeks ago`;
  }

  goBack(): void {
    this.router.navigate(['/workout/today']);
  }

  goToPast(): void {
    this.router.navigate(['/workout/past']);
  }
}