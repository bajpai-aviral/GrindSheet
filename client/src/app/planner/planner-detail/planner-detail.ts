import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { PlannerService } from '../planner';
import { Planner, PlanDay, PlanExercise } from '../../shared/models/planner.model';
import { PlanDayFormComponent } from '../plan-day-form/plan-day-form';
import { PlanExerciseFormComponent } from '../plan-exercise-form/plan-exercise-form';

@Component({
  selector: 'app-planner-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './planner-detail.html',
  styleUrl: './planner-detail.scss'
})
export class PlannerDetail implements OnInit {

  planner: Planner | null = null;
  isLoading = true;
  plannerId = '';

  daysOrder = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY',
    'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plannerService: PlannerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.plannerId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPlanner();
  }

  loadPlanner(): void {
  this.isLoading = true;
  this.plannerService.getPlanner(this.plannerId).subscribe({
    next: (planner) => {
      this.planner = { ...planner };
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.snackBar.open('Failed to load planner', 'Close', { duration: 3000 });
    }
  });
}

  // Get days in correct order
  getOrderedDays(): PlanDay[] {
    if (!this.planner?.days) return [];
    return [...this.planner.days].sort((a, b) =>
      this.daysOrder.indexOf(a.dayOfWeek) - this.daysOrder.indexOf(b.dayOfWeek)
    );
  }

  // Get days not yet added to planner
  getAvailableDays(): string[] {
    const existingDays = this.planner?.days.map(d => d.dayOfWeek) || [];
    return this.daysOrder.filter(d => !existingDays.includes(d));
  }

  // Open add day dialog
  openAddDay(): void {
    const dialogRef = this.dialog.open(PlanDayFormComponent, {
      width: '400px',
      data: {
        mode: 'create',
        plannerId: this.plannerId,
        availableDays: this.getAvailableDays()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlanner();
        this.snackBar.open('Day added!', 'Close', { duration: 3000 });
      }
    });
  }

  // Open edit day dialog
  openEditDay(day: PlanDay): void {
    const dialogRef = this.dialog.open(PlanDayFormComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        dayId: day.id,
        dayOfWeek: day.dayOfWeek,
        label: day.label,
        availableDays: this.getAvailableDays()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlanner();
        this.snackBar.open('Day updated!', 'Close', { duration: 3000 });
      }
    });
  }

  

  // Open add exercise dialog
  openAddExercise(day: PlanDay): void {
    const currentOrder = day.exercises?.length || 0;
    const dialogRef = this.dialog.open(PlanExerciseFormComponent, {
      width: '400px',
      data: {
        mode: 'create',
        dayId: day.id,
        exerciseOrder: currentOrder + 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlanner();
        this.snackBar.open('Exercise added!', 'Close', { duration: 3000 });
      }
    });
  }

  // Open edit exercise dialog
  openEditExercise(exercise: PlanExercise): void {
    const dialogRef = this.dialog.open(PlanExerciseFormComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        exerciseId: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        exerciseOrder: exercise.exerciseOrder
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlanner();
        this.snackBar.open('Exercise updated!', 'Close', { duration: 3000 });
      }
    });
  }

  deleteExercise(exercise: PlanExercise): void {
  if (!confirm(`Delete ${exercise.name}?`)) return;

  this.plannerService.deleteExercise(exercise.id).subscribe({
    next: () => {
      this.snackBar.open('Exercise deleted', 'Close', { duration: 3000 });
      this.loadPlanner();
    },
    error: () => {
      this.snackBar.open('Failed to delete exercise', 'Close', { duration: 3000 });
    }
  });
}

deleteDay(day: PlanDay): void {
  console.log('Deleting day:', day); // ← add this
  if (!confirm(`Delete ${day.dayOfWeek} - ${day.label}? This will also delete all exercises for this day.`)) return;

  this.plannerService.deleteDay(day.id).subscribe({
    next: () => {
      this.snackBar.open('Day deleted', 'Close', { duration: 3000 });
      this.loadPlanner();
    },
    error: () => {
      this.snackBar.open('Failed to delete day', 'Close', { duration: 3000 });
    }
  });
}



  // Activate planner
  activatePlanner(): void {
    this.plannerService.activatePlanner(this.plannerId).subscribe({
      next: () => {
        this.loadPlanner();
        this.snackBar.open('Planner activated!', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}