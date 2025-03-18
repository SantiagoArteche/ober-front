import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { MultiSelectUsersComponent } from '../../users/multi-select-users.component';
import { MultiSelectProjectsComponent } from '../../project/multi-select/multi-select-projects.component';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectUsersComponent,
    MultiSelectProjectsComponent,
  ],
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);

  isSubmitting = false;
  selectedUsers: any[] = [];
  selectedProject: any = null;

  createTaskForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    status: ['pending', Validators.required],
    endDate: ['', Validators.required],
  });

  onSelectedUsersChange(users: any[]): void {
    this.selectedUsers = users;
  }

  onSelectedProjectChange(project: any): void {
    this.selectedProject = project;
  }

  onSubmit(): void {
    if (this.createTaskForm.valid && this.selectedProject) {
      this.isSubmitting = true;

      const endDate = new Date(this.createTaskForm.value.endDate!);
      endDate.setDate(endDate.getDate() + 1);

      const newTask: any = {
        name: this.createTaskForm.value.name!,
        description: this.createTaskForm.value.description!,
        assignedTo: this.selectedUsers.map((user) => {
          if (typeof user === 'string') {
            return user;
          }
          return user._id || user.id;
        }),
        projectId:
          typeof this.selectedProject === 'string'
            ? this.selectedProject
            : this.selectedProject._id || this.selectedProject.id,
        status: this.createTaskForm.value.status!,
        endDate: endDate.toISOString().split('T')[0],
      };

      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
}
