import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-edit.component.html',
})
export class TaskEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskId: string | null = null;
  task: Task | null = null;
  isLoading = true;

  editProjectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    assignedTo: [''],
    projectId: ['', Validators.required],
    status: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.taskService.getTask(id).subscribe({
      next: (task: any) => {
        this.task = task.task;
        const endDate = new Date(this.task?.endDate!);
        endDate.setDate(endDate.getDate() - 1);
        this.editProjectForm.patchValue({
          name: this.task?.name,
          description: this.task?.description,
          assignedTo: this.task?.assignedTo.join(', '),
          projectId: this.task?.projectId,
          status: this.task?.status,
          endDate: this.task?.endDate
            ? new Date(endDate).toISOString().split('T')[0]
            : '',
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.editProjectForm.valid && this.taskId) {
      const endDate = new Date(this.editProjectForm.value.endDate!);
      endDate.setDate(endDate.getDate() + 1);
      const updatedTask: any = {
        ...this.task,
        name: this.editProjectForm.value.name!,
        description: this.editProjectForm.value.description!,
        assignedTo: this.editProjectForm.value.assignedTo
          ? this.editProjectForm.value.assignedTo
              ?.split(',')
              .map((user) => user.trim())
          : [],
        projectId: this.editProjectForm.value.projectId,
        status: this.editProjectForm.value.status,
        endDate: new Date(endDate).toISOString().split('T')[0],
      };

      this.taskService.updateTask(this.taskId, updatedTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
        },
      });
    }
  }
}
