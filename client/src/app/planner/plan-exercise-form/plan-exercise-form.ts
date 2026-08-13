import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PlannerService } from '../planner';

@Component({
  selector: 'app-plan-exercise-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data.mode === 'create' ? 'Add Exercise' : 'Edit Exercise' }}</h2>

      <div class="dialog-content">
        <form [formGroup]="form">

          <div class="field-group">
            <label>EXERCISE NAME</label>
            <input
              class="input-field"
              formControlName="name"
              placeholder="e.g. Bench Press">
            <span class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.hasError('required')">
              Name is required
            </span>
          </div>

          <div class="row">
            <div class="field-group">
              <label>SETS</label>
              <input
                class="input-field"
                type="number"
                formControlName="sets"
                min="1">
              <span class="field-error" *ngIf="form.get('sets')?.touched && form.get('sets')?.hasError('min')">
                Min 1
              </span>
            </div>

            <div class="field-group">
              <label>REPS</label>
              <input
                class="input-field"
                type="number"
                formControlName="reps"
                min="1">
              <span class="field-error" *ngIf="form.get('reps')?.touched && form.get('reps')?.hasError('min')">
                Min 1
              </span>
            </div>
          </div>

        </form>
      </div>

      <div class="dialog-actions">
        <button class="btn-cancel" (click)="dialogRef.close()">Cancel</button>
        <button
          class="btn-primary"
          [disabled]="form.invalid || isLoading"
          (click)="onSubmit()">
          {{ data.mode === 'create' ? 'Add' : 'Save' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: #1a1a1a;
      border-radius: 16px;
      padding: 28px;
      min-width: 380px;
    }

    .dialog-title {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 0 24px 0;
    }

    .dialog-content {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .row {
      display: flex;
      gap: 16px;

      .field-group { flex: 1; }
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.72rem;
        font-weight: 700;
        color: #555;
        letter-spacing: 0.08em;
      }

      .input-field {
        padding: 12px 16px;
        background: #222;
        border: 1px solid #2a2a2a;
        border-radius: 10px;
        color: #fff;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;
        width: 100%;

        &::placeholder { color: #444; }
        &:focus { border-color: #ff7f5c; }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button { -webkit-appearance: none; }
      }

      .field-error {
        color: #ff5252;
        font-size: 0.8rem;
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel {
      padding: 10px 20px;
      background: #222;
      border: 1px solid #333;
      border-radius: 10px;
      color: #999;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: #444; color: #fff; }
    }

    .btn-primary {
      padding: 10px 20px;
      background: linear-gradient(135deg, #ff7f5c, #ff5722);
      border: none;
      border-radius: 10px;
      color: #111;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;

      &:disabled { opacity: 0.4; cursor: not-allowed; }
      &:hover:not(:disabled) { opacity: 0.9; }
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