import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  isLoading = true;

  createProjectForm = this.fb.group({
    name: ['', Validators.required],
    users: [''],
  });

  onSubmit(): void {
    if (this.createProjectForm.valid) {
      const newProject: any = {
        name: this.createProjectForm.value.name!,
        users: this.createProjectForm.value.users
          ? this.createProjectForm.value.users
              ?.split(',')
              .map((user) => user.trim())
          : [],
      };

      this.projectService.createProject(newProject).subscribe({
        next: (newProject: any) => {
          this.router.navigate([
            '/projects',
            newProject.newProject._id,
            'view',
          ]);
        },
        error: (error) => {
          console.error('Error updating project:', error);
        },
      });
    }
  }
}
