import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PlannerService } from '../planner';

@Component({
  selector: 'app-planner-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data.mode === 'create' ? 'Create New Planner' : 'Rename Planner' }}</h2>

      <div class="dialog-content">
        <form [formGroup]="form">
          <div class="field-group">
            <label>PLANNER NAME</label>
            <input
              class="input-field"
              formControlName="name"
              placeholder="e.g. Push Pull Legs">
            <span class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.hasError('required')">
              Name is required
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
          {{ data.mode === 'create' ? 'Create' : 'Save' }}
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
export class PlannerFormComponent {

  form: FormGroup;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<PlannerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; plannerId?: string; name?: string },
    private fb: FormBuilder,
    private plannerService: PlannerService
  ) {
    this.form = this.fb.group({
      name: [data.name || '', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const request = { name: this.form.value.name };

    if (this.data.mode === 'create') {
      this.plannerService.createPlanner(request).subscribe({
        next: (planner) => this.dialogRef.close(planner),
        error: () => { this.isLoading = false; }
      });
    } else {
      this.plannerService.updatePlanner(this.data.plannerId!, request).subscribe({
        next: (planner) => this.dialogRef.close(planner),
        error: () => { this.isLoading = false; }
      });
    }
  }
}