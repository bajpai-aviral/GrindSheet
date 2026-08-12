import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Planner,
  PlannerRequest,
  PlanDayRequest,
  PlanExerciseRequest,
  PlanDay,
  PlanExercise
} from '../shared/models/planner.model';

@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  private apiUrl = `${environment.apiUrl}/planners`;

  constructor(private http: HttpClient) { }

  getAllPlanners(): Observable<Planner[]> {
    return this.http.get<Planner[]>(this.apiUrl);
  }

  getPlanner(id: string): Observable<Planner> {
    return this.http.get<Planner>(`${this.apiUrl}/${id}`);
  }

  createPlanner(request: PlannerRequest): Observable<Planner> {
    return this.http.post<Planner>(this.apiUrl, request);
  }

  updatePlanner(id: string, request: PlannerRequest): Observable<Planner> {
    return this.http.put<Planner>(`${this.apiUrl}/${id}`, request);
  }

  deletePlanner(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activatePlanner(id: string): Observable<Planner> {
    return this.http.put<Planner>(`${this.apiUrl}/${id}/activate`, {});
  }

  addDay(plannerId: string, request: PlanDayRequest): Observable<PlanDay> {
    return this.http.post<PlanDay>(`${this.apiUrl}/${plannerId}/days`, request);
  }

  updateDay(dayId: string, request: PlanDayRequest): Observable<PlanDay> {
    return this.http.put<PlanDay>(`${environment.apiUrl}/plan-days/${dayId}`, request);
  }

  deleteDay(dayId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/plan-days/${dayId}`,
      { responseType: 'text' });
  }

  addExercise(dayId: string, request: PlanExerciseRequest): Observable<PlanExercise> {
    return this.http.post<PlanExercise>(
      `${environment.apiUrl}/plan-days/${dayId}/exercises`, request);
  }

  updateExercise(exerciseId: string, request: PlanExerciseRequest): Observable<PlanExercise> {
    return this.http.put<PlanExercise>(
      `${environment.apiUrl}/plan-exercises/${exerciseId}`, request);
  }

  deleteExercise(exerciseId: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/plan-exercises/${exerciseId}`,
      { responseType: 'text' });
  }
}