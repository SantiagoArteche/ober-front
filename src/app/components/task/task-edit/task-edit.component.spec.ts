import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskEditComponent } from './task-edit.component';
import { TaskService } from '../../../services/task.service';

describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let fixture: ComponentFixture<TaskEditComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', [
      'getTask',
      'updateTask',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskEditComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '123' }),
          },
        },
      ],
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateTask service method on valid form submission', fakeAsync(() => {
    const mockTask = {
      _id: '123',
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: ['user1', 'user2'],
      projectId: '456',
      status: 'in progress',
      endDate: '2023-12-31',
      startDate: '2023-12-01',
    };

    taskServiceSpy.getTask.and.returnValue(of({ task: mockTask } as any));
    taskServiceSpy.updateTask.and.returnValue(of({} as any));

    fixture.detectChanges();
    tick();

    component.editProjectForm.patchValue({
      name: 'Updated Task',
      description: 'Updated Description',
      assignedTo: 'user1, user2',
      projectId: '456',
      status: 'in progress',
      endDate: '2023-12-30',
    });

    component.onSubmit();
    tick();

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(
      '123',
      jasmine.objectContaining({
        name: 'Updated Task',
        description: 'Updated Description',
        assignedTo: ['user1', 'user2'],
        projectId: '456',
        status: 'in progress',
        endDate: '2023-12-31',
      })
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('should handle error when task update fails', fakeAsync(() => {
    const mockTask = {
      _id: '123',
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: ['user1'],
      projectId: '456',
      status: 'pending',
      endDate: '2023-12-31',
      startDate: '2023-12-01',
    };

    taskServiceSpy.getTask.and.returnValue(of({ task: mockTask } as any));
    taskServiceSpy.updateTask.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    fixture.detectChanges();
    tick();

    component.editProjectForm.patchValue({
      name: 'Updated Task',
      description: 'Updated Description',
      assignedTo: 'user1, user2',
      projectId: '456',
      status: 'in progress',
      endDate: '2023-12-30',
    });

    spyOn(console, 'error');

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      'Error updating task:',
      jasmine.any(Error)
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
