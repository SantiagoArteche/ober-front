import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        RegisterComponent,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should mark username as invalid when empty', () => {
    const usernameControl = component.registerForm.get('username');
    expect(usernameControl?.valid).toBeFalsy();
    expect(usernameControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark email as invalid when empty', () => {
    const emailControl = component.registerForm.get('email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark email as invalid when format is incorrect', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should mark password as invalid when empty', () => {
    const passwordControl = component.registerForm.get('password');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark password as invalid when less than 8 characters', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('1234567');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should mark form as valid when all fields are correctly filled', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should call authService.register when form is submitted with valid data', () => {
    const mockUser = {
      newUser: {
        id: '1',
        name: 'testuser',
        email: 'test@example.com',
      },
    };
    mockAuthService.register.and.returnValue(of(mockUser));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'testuser',
      'test@example.com',
      'password123'
    );
  });

  it('should handle registration error', () => {
    mockAuthService.register.and.returnValue(
      throwError(() => new Error('Registration failed'))
    );
    spyOn(console, 'error');

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith(
      'Registration failed',
      jasmine.any(Error)
    );
  });

  it('should disable submit button when form is invalid', () => {
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeFalsy();
  });
});
