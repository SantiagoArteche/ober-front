import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);

  isLoading = true;

  createProjectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    assignedTo: [''],
    projectId: ['', Validators.required],
    status: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.createProjectForm.valid) {
      const endDate = new Date(this.createProjectForm.value.endDate!);
      endDate.setDate(endDate.getDate() + 1);
      const newTask: any = {
        name: this.createProjectForm.value.name!,
        description: this.createProjectForm.value.description!,
        assignedTo: this.createProjectForm.value.assignedTo
          ? this.createProjectForm.value.assignedTo
              ?.split(',')
              .map((user) => user.trim())
          : [],
        projectId: this.createProjectForm.value.projectId,
        status: this.createProjectForm.value.status,
        endDate: new Date(endDate).toISOString().split('T')[0],
      };

      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating project:', error);
        },
      });
    }
  }
}
