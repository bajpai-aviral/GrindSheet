import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PlannerService } from '../planner';

@Component({
  selector: 'app-plan-day-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Add Day' : 'Edit Day' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">

        <mat-form-field appearance="outline" class="full-width" *ngIf="data.mode === 'create'">
          <mat-label>Day of Week</mat-label>
          <mat-select formControlName="dayOfWeek">
            <mat-option *ngFor="let day of data.availableDays" [value]="day">
              {{ day }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('dayOfWeek')?.hasError('required')">
            Day is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Label</mat-label>
          <input matInput formControlName="label" placeholder="e.g. Push Day, Rest Day, Cardio">
          <mat-error *ngIf="form.get('label')?.hasError('required')">
            Label is required
          </mat-error>
        </mat-form-field>

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
  styles: [`.full-width { width: 100%; margin-top: 8px; }`]
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