import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DailyScreenResponse,
  SetLogRequest,
  SetLogResponse,
  CompareResponse,
  PastRecordResponse
} from '../shared/models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get today's workout screen
  getTodayScreen(date: string): Observable<DailyScreenResponse> {
    return this.http.get<DailyScreenResponse>(
      `${this.apiUrl}/logs/today?date=${date}`);
  }

  // Log a set
  logSet(request: SetLogRequest): Observable<SetLogResponse> {
    return this.http.post<SetLogResponse>(
      `${this.apiUrl}/logs/sets`, request);
  }

  // Get comparison
  getComparison(date: string): Observable<CompareResponse> {
    return this.http.get<CompareResponse>(
      `${this.apiUrl}/compare?date=${date}`);
  }

  // Get past record
  getPastRecord(date: string): Observable<PastRecordResponse> {
    return this.http.get<PastRecordResponse>(
      `${this.apiUrl}/logs/past?date=${date}`);
  }

  // Format date to YYYY-MM-DD
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Get today's date formatted
  getTodayFormatted(): string {
    return this.formatDate(new Date());
  }
}