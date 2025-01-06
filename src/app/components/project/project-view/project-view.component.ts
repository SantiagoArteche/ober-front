import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-task-view',
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './project-view.component.html',
})
export class ProjectViewComponent implements OnInit {
  projectId: string | null = null;
  project: Project | null = null;
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id');
    });
    this.loadTask();
  }

  loadTask(): void {
    if (this.projectId) {
      this.projectService.getProject(this.projectId).subscribe(
        (project: any) => {
          this.project = project.project;
        },
        (error) => {
          console.error('Error al cargar la tarea:', error);
        }
      );
    }
  }
}
