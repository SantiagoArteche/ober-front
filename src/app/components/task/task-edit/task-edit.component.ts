import { Component, type OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import type { Task } from '../../../models/task.model';
import { MultiSelectUsersComponent } from '../../users/multi-select-users.component';
import { MultiSelectProjectsComponent } from '../../project/multi-select/multi-select-projects.component';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectUsersComponent,
    MultiSelectProjectsComponent,
  ],
  templateUrl: './task-edit.component.html',
})
export class TaskEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskId: string | null = null;
  task: Task | null = null;
  isLoading = true;
  isSubmitting = false;
  selectedUsers: any[] = [];
  selectedProject: any = null;
  projectUsers: any[] = [];

  editTaskForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
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
        const formattedDate = endDate.toISOString().split('T')[0];

        this.editTaskForm.patchValue({
          name: this.task?.name,
          description: this.task?.description,
          status: this.task?.status,
          endDate: formattedDate,
        });

        this.selectedUsers = this.task?.assignedTo || [];

        const projectId =
          typeof this.task?.projectId === 'string'
            ? this.task?.projectId
            : this.task?.projectId?._id || (this.task?.projectId as any)?.id;

        if (projectId) {
          this.loadProjectDetails(projectId);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.isLoading = false;
      },
    });
  }

  loadProjectDetails(projectId: string): void {
    this.projectService.getProject(projectId).subscribe({
      next: (projectData: any) => {
        const project = projectData.project || projectData;

        this.selectedProject = project;

        if (project && project.users) {
          this.projectUsers = project.users;
          console.log('Project users loaded:', this.projectUsers);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project details:', error);
        this.isLoading = false;
      },
    });
  }

  onSelectedUsersChange(users: any[]): void {
    this.selectedUsers = users;
  }

  onSelectedProjectChange(project: any): void {
    if (this.selectedProject !== project) {
      this.selectedUsers = [];
    }

    this.selectedProject = project;

    if (project && project.users) {
      this.projectUsers = project.users;
    } else {
      this.projectUsers = [];
    }
  }

  onSubmit(): void {
    if (this.editTaskForm.valid && this.taskId && this.selectedProject) {
      this.isSubmitting = true;

      const endDate = new Date(this.editTaskForm.value.endDate!);
      endDate.setDate(endDate.getDate() + 1);

      const updatedTask: any = {
        ...this.task,
        name: this.editTaskForm.value.name!,
        description: this.editTaskForm.value.description!,
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
        status: this.editTaskForm.value.status!,
        endDate: endDate.toISOString().split('T')[0],
      };

      this.taskService.updateTask(this.taskId, updatedTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
}
