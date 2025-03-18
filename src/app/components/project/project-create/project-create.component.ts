import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { MultiSelectUsersComponent } from '../../users/multi-select-users.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectUsersComponent],
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  isSubmitting = false;
  selectedUsers: any[] = [];

  createProjectForm = this.fb.group({
    name: ['', Validators.required],
  });

  onSelectedUsersChange(users: any[]): void {
    this.selectedUsers = users;
  }

  onSubmit(): void {
    if (this.createProjectForm.valid) {
      this.isSubmitting = true;

      const newProject: any = {
        name: this.createProjectForm.value.name!,
        users: this.selectedUsers.map((user) => {
          if (typeof user === 'string') {
            return user;
          }
          return user._id || user.id;
        }),
      };

      this.projectService.createProject(newProject).subscribe({
        next: (response: any) => {
          const projectId = response.newProject?._id || response.newProject?.id;
          this.router.navigate(['/projects', projectId, 'view']);
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
}
