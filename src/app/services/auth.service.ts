import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `https://ober-deploy.vercel.app/api/auth`;

  private tokenSubject = new BehaviorSubject<string | null>(null);
  currentUser$ = this.tokenSubject.asObservable();

  constructor() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  login(email: string, password: string): Observable<string> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((user) => {
          localStorage.setItem('token', user.token);
          this.tokenSubject.next(user.token);
          return user.token;
        })
      );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/new-user`, { name, email, password })
      .pipe(
        map((user) => {
          this.tokenSubject.next(user.token);
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && this.getToken() != 'undefined';
  }
}
