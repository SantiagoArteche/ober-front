import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://ober-deploy.vercel.app/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.removeItem('token');
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store the token', (done) => {
    const mockToken = 'mocked-token';
    const email = 'test@example.com';
    const password = 'password123';

    service.login(email, password).subscribe((token: string) => {
      expect(token).toEqual(mockToken);
      expect(localStorage.getItem('token')).toEqual(mockToken);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: mockToken });

    expect(service.getToken()).toEqual(mockToken);
  });

  it('should register a new user', (done) => {
    const mockResponse = {
      token: 'mocked-token',
      user: { id: 1, name: 'Test User' },
    };
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'password123';

    service.register(name, email, password).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toEqual(mockResponse.token);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/new-user`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear the token', () => {
    localStorage.setItem('token', 'mocked-token');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getToken()).toBeNull();
  });

  it('should return false for isLoggedIn when no token is present', () => {
    localStorage.removeItem('token');

    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return false for isLoggedIn when token is "undefined"', () => {
    localStorage.setItem('token', 'undefined');

    console.log(service.getToken());
    expect(service.isLoggedIn()).toBeFalse();
  });
});
