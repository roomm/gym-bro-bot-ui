import {Injectable, signal, computed} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';


export interface GymClass {
  id: string;
  start_time: string
  end_time: string
  free_slots: number
  total_slots: number
  booked: boolean
  waiting_list: boolean
  instructor: {
    id: string
    name: string | null
    surname1: string | null
    surname2: string | null
    gender: number
  } | null
  room: {
    id: string
    name: string
  }
  activity: {
    id: string
    club_id: string
    club_name: string
    color: string
    name: string
    description: string
    description_basic: string
    description_extended: string | null
    description_short: string | null
    image: string | null
  }
}

export interface Booking {
  class_id: string;
  status: 'CONFIRMED' | 'SCHEDULED' | 'FAILED';
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  classes = signal<GymClass[]>([]);
  myBookings = signal<Booking[]>([]);

  loadingClasses = signal<boolean>(false);
  actionError = signal<string | null>(null);

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.token()}`
    });
  }

  fetchClasses(showLoader: boolean = true) {
    if (showLoader) {
      this.loadingClasses.set(true);
    }
    this.http.get<GymClass[]>(`${environment.baseUrl}/class-spot/list-classes`, {headers: this.getHeaders()}).subscribe({
      next: (data) => {
        // Sort by start time
        data.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        this.classes.set(data);
        if (showLoader) {
          this.loadingClasses.set(false);
        }
      },
      error: () => {
        if (showLoader) {
          this.loadingClasses.set(false);
        }
      }
    });
  }

  fetchMyBookings() {
    if (!this.auth.isLoggedIn()) return;
    this.http.get<Booking[]>(`${environment.baseUrl}/scheduler/my-schedule`, {headers: this.getHeaders()}).subscribe({
      next: (data) => this.myBookings.set(data),
      error: (err) => console.error('Failed to fetch bookings', err)
    });
  }

  bookClass(classId: string) {
    this.actionError.set(null);
    return this.http.get<Booking>(`${environment.baseUrl}/class-spot/book-class-spot/${classId}`, {headers: this.getHeaders()})
      .pipe(
        tap((booking) => {
          this.fetchMyBookings()
          this.fetchClasses(false); // Refresh counts quietly
        }),
        catchError(err => {
          this.actionError.set(err.error?.error || 'Failed to book class');
          return of(null);
        })
      );
  }

  scheduleClass(classActivity: GymClass) {
    this.actionError.set(null);
    return this.http.post<{ result: string, message: string }>(`${environment.baseUrl}/scheduler/schedule-spot`, classActivity, {headers: this.getHeaders()})
      .pipe(
        tap((booking) => {
          this.fetchMyBookings()
          this.fetchClasses(false); // Refresh counts quietly
        }),
        catchError(err => {
          this.actionError.set(err.error?.error || 'Failed to schedule class');
          return of(null);
        })
      );
  }


  cancelScheduledClass(classActivity: GymClass) {
    this.actionError.set(null);
    return this.http.post<{ result: string, message: string }>(`${environment.baseUrl}/scheduler/cancel-schedule-spot`, classActivity, {headers: this.getHeaders()})
      .pipe(
        tap((booking) => {
          this.fetchMyBookings()
          this.fetchClasses(false); // Refresh counts quietly
        }),
        catchError(err => {
          this.actionError.set(err.error?.error || 'Failed to cancel scheduled class');
          return of(null);
        })
      );
  }


  cancelBooking(classId: string) {
    this.actionError.set(null);
    return this.http.get(`${environment.baseUrl}/class-spot/cancel-class-spot/${classId}`, {headers: this.getHeaders()})
      .pipe(
        tap(() => {
          this.fetchMyBookings()
          this.fetchClasses(false); // Refresh counts quietly
        }),
        catchError(err => {
          this.actionError.set(err.error?.error || 'Failed to cancel booking');
          return of(null);
        })
      );
  }
}
