import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../../services/project.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let projectServiceSpy: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectService', [
      'getProjects',
      'deleteProject',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ProjectListComponent,
        MatTableModule,
        RouterTestingModule,
        ScrollingModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: ProjectService, useValue: spy }],
    }).compileComponents();

    projectServiceSpy = TestBed.inject(
      ProjectService
    ) as jasmine.SpyObj<ProjectService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    const mockProjects = {
      projects: [
        {
          _id: '1',
          name: 'Project 1',
          users: ['user1'],
          tasks: [{ _id: 'task1' }],
        },
        {
          _id: '2',
          name: 'Project 2',
          users: ['user2'],
          tasks: [{ _id: 'task2' }],
        },
      ],
    };
    projectServiceSpy.getProjects.and.returnValue(of(mockProjects as any));

    fixture.detectChanges();

    expect(component.projects).toEqual(mockProjects.projects as any);
    expect(component.tasks).toEqual(['task1', 'task2']);
  });

  it('should handle error when loading projects', () => {
    projectServiceSpy.getProjects.and.returnValue(
      throwError(() => new Error('Error loading projects'))
    );
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith(
      'Error loading projects',
      jasmine.any(Error)
    );
  });

  it('should delete project when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    projectServiceSpy.deleteProject.and.returnValue(of({} as any));
    spyOn(component, 'loadProjects');

    component.deleteProject('1');

    expect(projectServiceSpy.deleteProject).toHaveBeenCalledWith('1');
    expect(component.loadProjects).toHaveBeenCalled();
  });

  it('should not delete project when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteProject('1');

    expect(projectServiceSpy.deleteProject).not.toHaveBeenCalled();
  });

  it('should handle error when deleting project', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    projectServiceSpy.deleteProject.and.returnValue(
      throwError(() => new Error('Error deleting project'))
    );
    spyOn(console, 'error');

    component.deleteProject('1');

    expect(console.error).toHaveBeenCalledWith(
      'Error deleting project',
      jasmine.any(Error)
    );
  });
});
