import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  editProjectForm = this.fb.group({
    name: ['', Validators.required],
    users: [''],
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
          users: this.project?.users.join(', '),
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
    if (this.editProjectForm.valid && this.projectId) {
      const updatedProject: any = {
        ...this.project,
        name: this.editProjectForm.value.name!,
        users: this.editProjectForm.value.users
          ? this.editProjectForm.value.users
              ?.split(',')
              .map((user) => user.trim())
          : [],
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
