import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskCreateComponent } from './task-create.component';
import { TaskService } from '../../../services/task.service';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['createTask']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.createProjectForm.get('name')?.value).toBe('');
    expect(component.createProjectForm.get('description')?.value).toBe('');
    expect(component.createProjectForm.get('assignedTo')?.value).toBe('');
    expect(component.createProjectForm.get('projectId')?.value).toBe('');
    expect(component.createProjectForm.get('status')?.value).toBe('');
    expect(component.createProjectForm.get('endDate')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.createProjectForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.createProjectForm.patchValue({
      name: 'Test Task',
      description: 'Test Description',
      projectId: '123',
      status: 'pending',
      endDate: '2023-12-31',
    });
    expect(component.createProjectForm.valid).toBeTruthy();
  });

  it('should call createTask service method on valid form submission', fakeAsync(() => {
    const mockTask = {
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: 'user1, user2',
      projectId: '123',
      status: 'pending',
      endDate: '2023-12-30',
    };

    component.createProjectForm.patchValue(mockTask);
    taskServiceSpy.createTask.and.returnValue(of({} as any));

    component.onSubmit();
    tick();

    const expectedTask = {
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: ['user1', 'user2'],
      projectId: '123',
      status: 'pending',
      endDate: '2023-12-31', 
    };

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(jasmine.objectContaining(expectedTask));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('should handle error when task creation fails', fakeAsync(() => {
    const mockTask = {
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: 'user1, user2',
      projectId: '123',
      status: 'pending',
      endDate: '2023-12-30',
    };

    component.createProjectForm.patchValue(mockTask);
    taskServiceSpy.createTask.and.returnValue(throwError(() => new Error('Creation failed')));

    spyOn(console, 'error');

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error creating project:', jasmine.any(Error));
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});

