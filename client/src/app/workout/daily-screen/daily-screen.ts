import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { WorkoutService } from '../workout';
import {
  DailyScreenResponse,
  ExerciseScreenResponse,
  SetScreenResponse
} from '../../shared/models/workout.model';

@Component({
  selector: 'app-daily-screen',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './daily-screen.html',
  styleUrl: './daily-screen.scss'
})
export class DailyScreen implements OnInit {

  screen: DailyScreenResponse | null = null;
  isLoading = true;
  today = '';
  displayDate = '';

  // Track weight inputs per exercise per set
  weightInputs: { [exerciseId: string]: { [setNumber: number]: number | null } } = {};
  savingSet: { [key: string]: boolean } = {};

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
    this.loadTodayScreen();
  }

  loadTodayScreen(): void {
    this.isLoading = true;
    this.workoutService.getTodayScreen(this.today).subscribe({
      next: (screen) => {
        this.screen = screen;
        this.initWeightInputs(screen);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (err.status === 404 || err.error?.error?.includes('No plan found')) {
          this.snackBar.open(
            'No workout planned for today. Check your planner!',
            'Go to Planner',
            { duration: 5000 }
          ).onAction().subscribe(() => this.router.navigate(['/dashboard']));
        } else if (err.error?.error?.includes('No active planner')) {
          this.snackBar.open(
            'No active planner. Please activate one first!',
            'Go to Dashboard',
            { duration: 5000 }
          ).onAction().subscribe(() => this.router.navigate(['/dashboard']));
        }
      }
    });
  }

  // Initialize weight inputs from already logged sets
  initWeightInputs(screen: DailyScreenResponse): void {
    screen.exercises.forEach(exercise => {
      this.weightInputs[exercise.planExerciseId] = {};
      exercise.sets.forEach(set => {
        this.weightInputs[exercise.planExerciseId][set.setNumber] =
          set.loggedWeight ?? null;
      });
    });
  }

  // Log a single set
  logSet(exercise: ExerciseScreenResponse, set: SetScreenResponse): void {
  const weight = this.weightInputs[exercise.planExerciseId]?.[set.setNumber];
  if (weight === null || weight === undefined) {
    this.snackBar.open('Please enter a weight first', 'Close', { duration: 2000 });
    return;
  }

  const key = `${exercise.planExerciseId}-${set.setNumber}`;
  this.savingSet[key] = true;

  this.workoutService.logSet({
    workoutLogId: this.screen!.workoutLogId,
    planExerciseId: exercise.planExerciseId,
    setNumber: set.setNumber,
    weightUsed: weight,
    notes: ''
  }).subscribe({
    next: () => {
      this.savingSet[key] = false;
      this.snackBar.open(
        `Set ${set.setNumber} logged — ${weight}kg`,
        'Close',
        { duration: 2000 }
      );
      // Reload screen to get updated loggedWeight
      this.loadTodayScreen();
    },
    error: () => {
      this.savingSet[key] = false;
      this.snackBar.open('Failed to log set', 'Close', { duration: 2000 });
      this.cdr.detectChanges();
    }
  });
}

  // Check if set is being saved
  isSaving(exerciseId: string, setNumber: number): boolean {
    return this.savingSet[`${exerciseId}-${setNumber}`] || false;
  }

  // Get weight difference label
  getWeightDiff(current: number | null, previous: number | null): string {
    if (!current || !previous) return '';
    const diff = current - previous;
    if (diff > 0) return `+${diff}kg ↑`;
    if (diff < 0) return `${diff}kg ↓`;
    return 'Same';
  }

  // Get diff class for color
  getDiffClass(current: number | null, previous: number | null): string {
    if (!current || !previous) return '';
    const diff = current - previous;
    if (diff > 0) return 'improved';
    if (diff < 0) return 'decreased';
    return 'same';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCompare(): void {
    this.router.navigate(['/workout/compare']);
  }
}