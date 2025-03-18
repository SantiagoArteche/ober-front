import { Component, type OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import type { Project } from '../../../models/project.model';
import { MultiSelectUsersComponent } from '../../users/multi-select-users.component';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectUsersComponent],
  templateUrl: './project-edit.component.html',
})
export class ProjectEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  projectId: string | null = null;
  project: Project | null = null;
  isLoading = true;
  selectedUsers: any[] = [];

  editProjectForm = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.loadProject(this.projectId);
      }
    });
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.projectService.getProject(id).subscribe({
      next: (project: any) => {
        this.project = project.project;
        this.editProjectForm.patchValue({
          name: this.project?.name,
        });

        this.selectedUsers = (this.project?.users || []).map((user: any) => {
          if (typeof user === 'string') {
            return user;
          }
          return user;
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.isLoading = false;
      },
    });
  }

  onSelectedUsersChange(users: any[]): void {
    this.selectedUsers = users;
  }

  onSubmit(): void {
    if (this.editProjectForm.valid && this.projectId) {
      const updatedProject: any = {
        ...this.project,
        name: this.editProjectForm.value.name!,
        users: this.selectedUsers.map((selectedUser) => {
          if (typeof selectedUser === 'string') {
            return selectedUser;
          }
          return selectedUser._id || selectedUser.id;
        }),
      };

      this.projectService
        .updateProject(this.projectId, updatedProject)
        .subscribe({
          next: () => {
            this.router.navigate(['/projects', this.projectId, 'view']);
          },
          error: (error) => {
            console.error('Error updating project:', error);
          },
        });
    }
  }
}
