import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectService } from '../../../services/project.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Project } from '../../../models/project.model';

describe('ProjectCreateComponent', () => {
  let component: ProjectCreateComponent;
  let fixture: ComponentFixture<ProjectCreateComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', [
      'createProject',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ProjectCreateComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCreateComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(
      ProjectService
    ) as jasmine.SpyObj<ProjectService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the createProjectForm', () => {
    expect(component.createProjectForm).toBeDefined();
    expect(component.createProjectForm.controls['name']).toBeDefined();
    expect(component.createProjectForm.controls['users']).toBeDefined();
  });

  it('should display an error message if the name is invalid', () => {
    const nameControl = component.createProjectForm.controls['name'];
    nameControl.setValue('');
    nameControl.markAsTouched();

    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.text-red-600');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain(
      'El nombre del proyecto es requerido'
    );
  });

  it('should not call ProjectService createProject if the form is invalid', () => {
    component.createProjectForm.controls['name'].setValue('');
    component.onSubmit();

    expect(projectService.createProject).not.toHaveBeenCalled();
  });

  it('should call ProjectService createProject and navigate to the project view on success', () => {
    const mockResponse = { newProject: { _id: '123' } };
    projectService.createProject.and.returnValue(of(mockResponse as any));

    component.createProjectForm.controls['name'].setValue('New Project');
    component.createProjectForm.controls['users'].setValue('user1,user2');

    component.onSubmit();

    expect(projectService.createProject).toHaveBeenCalledWith({
      name: 'New Project',
      users: ['user1' as any, 'user2' as any],
    } as any);
    expect(router.navigate).toHaveBeenCalledWith(['/projects', '123', 'view']);
  });

  it('should log an error if createProject fails', () => {
    spyOn(console, 'error');
    projectService.createProject.and.returnValue(
      throwError(() => new Error('Creation failed'))
    );

    component.createProjectForm.controls['name'].setValue('New Project');
    component.createProjectForm.controls['users'].setValue('');

    component.onSubmit();

    expect(projectService.createProject).toHaveBeenCalledWith({
      name: 'New Project',
      users: [],
    } as any);
    expect(console.error).toHaveBeenCalledWith(
      'Error updating project:',
      jasmine.any(Error)
    );
  });

  it('should disable the submit button if the form is invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.createProjectForm.controls['name'].setValue('');

    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('should enable the submit button if the form is valid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.createProjectForm.controls['name'].setValue('New Project');
    component.createProjectForm.controls['users'].setValue('user1,user2');

    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });
});
