import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterSuccessDialogComponent } from './register-user.dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatDialogModule],
  templateUrl: './register.component.html',
  styles: [
    `
      .register-container {
        max-width: 300px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      form {
        display: flex;
        flex-direction: column;
      }
      label {
        margin-top: 10px;
      }
      input {
        margin-bottom: 5px;
      }
      button {
        margin-top: 20px;
      }
    `,
  ],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.register(username!, email!, password!).subscribe({
        next: (user) => {
          this.dialog.open(RegisterSuccessDialogComponent, {
            data: {
              id: user.newUser.id,
              username: user.newUser.name,
              email: user.newUser.email,
            },
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
    }
  }
}
