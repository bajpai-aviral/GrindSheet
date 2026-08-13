import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PlannerService } from '../planner';

@Component({
  selector: 'app-plan-day-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data.mode === 'create' ? 'Add Day' : 'Edit Day' }}</h2>

      <div class="dialog-content">
        <form [formGroup]="form">

          <div class="field-group" *ngIf="data.mode === 'create'">
            <label>DAY OF WEEK</label>
            <select class="select-field" formControlName="dayOfWeek">
              <option value="" disabled>Select a day</option>
              <option *ngFor="let day of data.availableDays" [value]="day">{{ day }}</option>
            </select>
            <span class="field-error" *ngIf="form.get('dayOfWeek')?.touched && form.get('dayOfWeek')?.hasError('required')">
              Day is required
            </span>
          </div>

          <div class="field-group">
            <label>LABEL</label>
            <input
              class="input-field"
              formControlName="label"
              placeholder="e.g. Push Day, Rest Day, Cardio">
            <span class="field-error" *ngIf="form.get('label')?.touched && form.get('label')?.hasError('required')">
              Label is required
            </span>
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

      .input-field, .select-field {
        padding: 12px 16px;
        background: #222;
        border: 1px solid #2a2a2a;
        border-radius: 10px;
        color: #fff;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s;
        width: 100%;
        appearance: none;

        &::placeholder { color: #444; }
        &:focus { border-color: #ff7f5c; }

        option {
          background: #222;
          color: #fff;
        }
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
export class PlanDayFormComponent {

  form: FormGroup;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<PlanDayFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: string;
      plannerId?: string;
      dayId?: string;
      dayOfWeek?: string;
      label?: string;
      availableDays: string[];
    },
    private fb: FormBuilder,
    private plannerService: PlannerService
  ) {
    this.form = this.fb.group({
      dayOfWeek: [data.dayOfWeek || '', data.mode === 'create' ? [Validators.required] : []],
      label: [data.label || '', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    if (this.data.mode === 'create') {
      this.plannerService.addDay(this.data.plannerId!, {
        dayOfWeek: this.form.value.dayOfWeek,
        label: this.form.value.label
      }).subscribe({
        next: (day) => this.dialogRef.close(day),
        error: () => { this.isLoading = false; }
      });
    } else {
      this.plannerService.updateDay(this.data.dayId!, {
        dayOfWeek: this.data.dayOfWeek!,
        label: this.form.value.label
      }).subscribe({
        next: (day) => this.dialogRef.close(day),
        error: () => { this.isLoading = false; }
      });
    }
  }
}