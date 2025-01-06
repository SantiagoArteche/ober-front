import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-success-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Registro Exitoso</h2>
    <mat-dialog-content>
      <p>¡Bienvenido, {{ data.username }}!</p>
      <p>id: {{ data.id }}</p>
      <p>Email: {{ data.email }}</p>
      <p>Tu cuenta ha sido creada con éxito.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="true">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 20px;
        max-width: 400px;
      }
    `,
  ],
})
export class RegisterSuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { username: string; email: string; id: string }
  ) {}
}
