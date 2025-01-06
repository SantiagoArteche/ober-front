import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'project-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ScrollingModule,
  ],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  tasks: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'users', 'tasks', 'actions'];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects: any) => {
        this.projects = projects.projects;
        projects.projects.forEach((projects: Project) =>
          projects?.tasks.forEach((taskArray: Task) =>
            this.tasks.push(taskArray._id)
          )
        );
      },
      (error) => {
        console.error('Error loading projects', error);
      }
    );
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(
        () => {
          this.loadProjects();
        },
        (error) => {
          console.error('Error deleting project', error);
        }
      );
    }
  }
}
