import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  type OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProjectService } from '../../../services/project.service';
import { ClickOutsideDirective } from '../../users/click-outside.directive';

interface Project {
  id?: string;
  _id?: string;
  name: string;
}

@Component({
  selector: 'app-multi-select-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './multi-select-projects.component.html',
})
export class MultiSelectProjectsComponent implements OnInit {
  @Input() selectedProject: any = null;
  @Output() selectedProjectChange = new EventEmitter<any>();
  @Input() required = false;

  private projectService = inject(ProjectService);
  private searchSubject = new Subject<string>();

  isOpen = false;
  searchTerm = '';
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  projectMap: Map<string, Project> = new Map();

  ngOnInit(): void {
    this.loadProjects();

    // Set up search with debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.filterProjects(term);
      });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        this.allProjects = response.projects || [];

        // Create a map for quick project lookup by ID
        this.projectMap.clear();
        this.allProjects.forEach((project) => {
          const id = project.id || project._id;
          if (id) {
            this.projectMap.set(id, project);
          }
        });

        this.filterProjects(this.searchTerm);
      },
      error: (error) => console.error('Error loading projects:', error),
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterProjects(this.searchTerm);
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  filterProjects(term: string): void {
    if (!this.allProjects) return;

    if (!term.trim()) {
      // If no search term, show all projects
      this.filteredProjects = [...this.allProjects];
    } else {
      // Filter by search term
      this.filteredProjects = this.allProjects.filter((project) => {
        return project.name.toLowerCase().includes(term.toLowerCase());
      });
    }
  }

  isSelected(projectId: string | undefined): boolean {
    if (!projectId || !this.selectedProject) return false;

    if (typeof this.selectedProject === 'string') {
      return this.selectedProject === projectId;
    }

    return (
      this.selectedProject.id === projectId ||
      this.selectedProject._id === projectId
    );
  }

  selectProject(projectId: string | undefined): void {
    if (!projectId) return;

    const project = this.projectMap.get(projectId);
    if (project) {
      this.selectedProject = project;
      this.selectedProjectChange.emit(project);
      this.closeDropdown();
      this.searchTerm = '';
    }
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.selectedProject = null;
    this.selectedProjectChange.emit(null);
  }

  getProjectName(): string {
    if (!this.selectedProject) return '';

    if (typeof this.selectedProject === 'string') {
      const project = this.projectMap.get(this.selectedProject);
      return project ? project.name : 'Proyecto';
    }

    return this.selectedProject.name || 'Proyecto';
  }
}
