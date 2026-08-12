import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlannerService } from '../../planner/planner';
import { AuthService } from '../../auth/auth';
import { Planner } from '../../shared/models/planner.model';
import { PlannerFormComponent } from '../../planner/planner-form/planner-form';

@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {

  planners: Planner[] = [];
  isLoading = true;
  userName = '';

  constructor(
    private plannerService: PlannerService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.name || 'Athlete';
    this.loadPlanners();
  }

  loadPlanners(): void {
    this.isLoading = true;
    this.plannerService.getAllPlanners().subscribe({
      next: (planners) => {
        this.planners = [...planners];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (err.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  openCreatePlanner(): void {
    const dialogRef = this.dialog.open(PlannerFormComponent, {
      width: '400px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlanners();
        this.snackBar.open('Planner created successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  activatePlanner(planner: Planner): void {
    this.plannerService.activatePlanner(planner.id).subscribe({
      next: () => {
        this.loadPlanners();
        this.snackBar.open(`${planner.name} activated!`, 'Close', { duration: 3000 });
      }
    });
  }

  openPlanner(planner: Planner): void {
    this.router.navigate(['/planner', planner.id]);
  }

  goToToday(): void {
    this.router.navigate(['/workout/today']);
  }

  getActivePlanner(): Planner | undefined {
    return this.planners.find(p => p.active);
  }

  logout(): void {
    this.authService.logout();
  }
}