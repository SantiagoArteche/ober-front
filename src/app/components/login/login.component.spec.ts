import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {}; 

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should display an error message if the email is invalid', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();

    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.text-red-600');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('El email debe ser valido');
  });

  it('should not call AuthService login if the form is invalid', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call AuthService login and navigate to home on success', () => {
    const mockToken = 'mock-token';
    authService.login.and.returnValue(of(mockToken));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log an error on login failure', () => {
    spyOn(console, 'error');
    authService.login.and.returnValue(
      throwError(() => new Error('Login failed'))
    );

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('wrong-password');
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'wrong-password'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Login failed',
      jasmine.any(Error)
    );
  });

  it('should disable the login button if the form is invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');

    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('should enable the login button if the form is valid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');

    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });
});
