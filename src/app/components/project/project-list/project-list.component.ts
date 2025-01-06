import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Task } from '../../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  tasks: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'users', 'tasks', 'actions'];

  filterForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private projectService: ProjectService) {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
      status: new FormControl(''),
      dueDate: new FormControl(null),
      assignedUser: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.setupFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects: any) => {
        this.projects = projects.projects;
        this.filteredProjects = this.projects;
        this.projects.forEach((project: Project) =>
          project?.tasks.forEach((taskArray: Task) =>
            this.tasks.push(taskArray._id)
          )
        );
      },
      (error) => {
        console.error('Error loading projects', error);
      }
    );
  }

  setupFilters(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterProjects();
      });
  }

  filterProjects(): void {
    const { search, assignedUser } = this.filterForm.value;

    this.filteredProjects = this.projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project._id.toLowerCase().includes(search.toLowerCase());

      const matchesAssignedUser =
        !assignedUser ||
        project.users.some((user: any) =>
          user.toLowerCase().includes(assignedUser.toLowerCase())
        );

      return matchesSearch && matchesAssignedUser;
    });
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
