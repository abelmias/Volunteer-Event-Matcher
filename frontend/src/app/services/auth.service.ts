import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtResponse } from '../models/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(registrationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registrationData);
  }

  login(credentials: any): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(map((response: JwtResponse) => {
        if (response && response.token && response.user) {
          const user = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            role: response.user.role,
            firstName: response.user.firstName,
            lastName: response.user.lastName
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
