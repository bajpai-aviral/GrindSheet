import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'sweatsheet_token';
  private userKey = 'sweatsheet_user';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthResponse | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response));
    this.isLoggedInSubject.next(true);
  }

  isTokenValid(): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch {
    return false;
  }
}
}