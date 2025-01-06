import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectViewComponent } from './project-view.component';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectViewComponent', () => {
  let component: ProjectViewComponent;
  let fixture: ComponentFixture<ProjectViewComponent>;
  let projectServiceSpy: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectService', ['getProject']);

    await TestBed.configureTestingModule({
      imports: [
        ProjectViewComponent,
        RouterTestingModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatTooltipModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ProjectService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' }),
          },
        },
      ],
    }).compileComponents();

    projectServiceSpy = TestBed.inject(
      ProjectService
    ) as jasmine.SpyObj<ProjectService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load project on init', () => {
    const mockProject = {
      project: {
        _id: '1',
        name: 'Test Project',
        users: ['user1', 'user2'],
        tasks: ['task1', 'task2'],
      },
    };
    projectServiceSpy.getProject.and.returnValue(of(mockProject as any));

    fixture.detectChanges();

    expect(component.project).toEqual(mockProject.project as any);
  });

  it('should handle error when loading project', () => {
    projectServiceSpy.getProject.and.returnValue(
      throwError(() => new Error('Error loading project'))
    );
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith(
      'Error al cargar la tarea:',
      jasmine.any(Error)
    );
  });
});
