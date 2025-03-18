import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectEditComponent } from './project-edit.component';
import { ProjectService } from '../../../services/project.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectEditComponent', () => {
  let component: ProjectEditComponent;
  let fixture: ComponentFixture<ProjectEditComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', [
      'updateProject',
      'getProject',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      paramMap: of(convertToParamMap({ id: '123' })),
    };

    projectServiceSpy.getProject.and.returnValue(
      of({
        project: { _id: '123', name: 'Project', users: ['user1', 'user2'] },
      })
    );

    await TestBed.configureTestingModule({
      imports: [
        ProjectEditComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectEditComponent);
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

  it('should initialize the editProjectForm with project data', () => {
    expect(component.editProjectForm).toBeDefined();
    expect(component.editProjectForm.controls['name'].value).toBe('Project');
    expect(component.editProjectForm.controls['users'].value).toEqual(
      'user1, user2'
    );
  });

  it('should display an error message if the name is invalid', () => {
    const nameControl = component.editProjectForm.controls['name'];
    nameControl.setValue('');
    nameControl.markAsTouched();

    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.text-red-600');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain(
      'El nombre del proyecto es requerido'
    );
  });

  it('should not call ProjectService updateProject if the form is invalid', () => {
    component.editProjectForm.controls['name'].setValue('');
    component.onSubmit();

    expect(projectService.updateProject).not.toHaveBeenCalled();
  });

  it('should call ProjectService updateProject and navigate to the project view on success', () => {
    const mockResponse = { updatedProject: { _id: '123' } };
    projectService.updateProject.and.returnValue(of(mockResponse as any));

    component.editProjectForm.controls['name'].setValue('Updated Project');
    component.editProjectForm.controls['users'].setValue('user1, user2');

    component.onSubmit();

    expect(projectService.updateProject).toHaveBeenCalledWith('123', {
      _id: '123',
      name: 'Updated Project',
      users: ['user1', 'user2'],
    } as any);
    expect(router.navigate).toHaveBeenCalledWith(['/projects', '123', 'view']);
  });

  it('should log an error if updateProject fails', () => {
    spyOn(console, 'error');
    projectService.updateProject.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    component.editProjectForm.controls['name'].setValue('Updated Project');
    component.editProjectForm.controls['users'].setValue('user1');

    component.onSubmit();

    expect(projectService.updateProject).toHaveBeenCalledWith('123', {
      _id: '123',
      name: 'Updated Project',
      users: ['user1'],
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
    component.editProjectForm.controls['name'].setValue('');

    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('should enable the submit button if the form is valid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    component.editProjectForm.controls['name'].setValue('Updated Project');
    component.editProjectForm.controls['users'].setValue('user1, user2');

    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });
});
