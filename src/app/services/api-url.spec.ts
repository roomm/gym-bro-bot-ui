import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {ClassService} from './class.service';

describe('API URL', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the configured URL for authentication', () => {
    TestBed.inject(AuthService).login('user@example.com', 'password').subscribe();
    const request = http.expectOne(`${environment.baseUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    request.flush({error: 'Invalid credentials'}, {status: 401, statusText: 'Unauthorized'});
  });

  it('uses the configured URL for classes', () => {
    TestBed.inject(ClassService).fetchClasses();
    const request = http.expectOne(`${environment.baseUrl}/class-spot/list-classes`);
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
