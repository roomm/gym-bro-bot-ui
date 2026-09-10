import {Injectable, signal, Inject, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {catchError, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'gym_auth_token';
  private readonly userKey = 'gym_auth_user';
  private readonly baseUrl = 'http://localhost:55555/api';
  // Signals for state
  currentUser = signal<{ id: string, email: string } | null>(null);
  token = signal<string | null>(null);
  authError = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.userKey);
      if (storedToken) {
        this.token.set(storedToken);
      }
      if (storedUser) {
        this.currentUser.set(JSON.parse(storedUser));
      }
    }
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  login(email: string, password: string) {
    this.authError.set(null);
    return this.http.post<{ access_token: string, token_type: string, user: { id: string, email: string } }>(`${this.baseUrl}/auth/login`, {email, password})
      .pipe(
        tap(res => {
          this.setSession(res.access_token, res.user);
          this.router.navigate(['/dashboard']);
        }),
        catchError(err => {
          this.authError.set(err.error?.error || 'Login failed');
          return of(null);
        })
      );
  }


  logout() {
    this.currentUser.set(null);
    this.token.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigate(['/login']);
  }

  private setSession(token: string, user: { id: string, email: string }) {
    this.token.set(token);
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }
}
