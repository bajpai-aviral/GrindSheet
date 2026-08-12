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
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create New Planner' : 'Rename Planner' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Planner Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Push Pull Legs">
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
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
        {{ data.mode === 'create' ? 'Create' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-top: 8px; }`]
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