import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  forgotPassword(data: { email: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, data);
  }

  verifyOtp(data: { otp: string; email: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-otp`, data);
  }

  resetPassword(data: { password: string; token: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data);
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
