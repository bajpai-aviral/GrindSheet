import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PlannerService } from '../planner';

@Component({
  selector: 'app-plan-exercise-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Add Exercise' : 'Edit Exercise' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Exercise Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Bench Press">
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Sets</mat-label>
            <input matInput type="number" formControlName="sets" min="1">
            <mat-error *ngIf="form.get('sets')?.hasError('required')">Required</mat-error>
            <mat-error *ngIf="form.get('sets')?.hasError('min')">Min 1</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reps</mat-label>
            <input matInput type="number" formControlName="reps" min="1">
            <mat-error *ngIf="form.get('reps')?.hasError('required')">Required</mat-error>
            <mat-error *ngIf="form.get('reps')?.hasError('min')">Min 1</mat-error>
          </mat-form-field>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="form.invalid || isLoading"
        (click)="onSubmit()">
        {{ data.mode === 'create' ? 'Add' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-top: 8px; }
    .row {
      display: flex;
      gap: 16px;
      mat-form-field { flex: 1; }
    }
  `]
})
export class PlanExerciseFormComponent {

  form: FormGroup;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<PlanExerciseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: string;
      dayId?: string;
      exerciseId?: string;
      name?: string;
      sets?: number;
      reps?: number;
      exerciseOrder?: number;
    },
    private fb: FormBuilder,
    private plannerService: PlannerService
  ) {
    this.form = this.fb.group({
      name: [data.name || '', [Validators.required]],
      sets: [data.sets || 3, [Validators.required, Validators.min(1)]],
      reps: [data.reps || 10, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const request = {
      name: this.form.value.name,
      sets: this.form.value.sets,
      reps: this.form.value.reps,
      exerciseOrder: this.data.exerciseOrder || 1
    };

    if (this.data.mode === 'create') {
      this.plannerService.addExercise(this.data.dayId!, request).subscribe({
        next: (exercise) => this.dialogRef.close(exercise),
        error: () => { this.isLoading = false; }
      });
    } else {
      this.plannerService.updateExercise(this.data.exerciseId!, request).subscribe({
        next: (exercise) => this.dialogRef.close(exercise),
        error: () => { this.isLoading = false; }
      });
    }
  }
}