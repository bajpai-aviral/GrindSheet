import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/landing/landing').then(m => m.Landing),
    canActivate: [authGuard]
  },
  {
    path: 'planner',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./planner/planner-list/planner-list').then(m => m.PlannerList)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./planner/planner-detail/planner-detail').then(m => m.PlannerDetail)
      }
    ]
  },
  {
    path: 'workout',
    canActivate: [authGuard],
    children: [
      {
        path: 'today',
        loadComponent: () =>
          import('./workout/daily-screen/daily-screen').then(m => m.DailyScreen)
      },
      {
        path: 'compare',
        loadComponent: () =>
          import('./workout/compare/compare').then(m => m.Compare)
      },
      {
        path: 'past',
        loadComponent: () =>
          import('./workout/past-records/past-records').then(m => m.PastRecords)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];