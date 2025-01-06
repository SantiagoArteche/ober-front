import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../services/task.service';
import { of, throwError } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'updateTaskStatus',
      'deleteTask',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        RouterTestingModule,
        DragDropModule,
        MatMenuModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: TaskService, useValue: spy }],
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', fakeAsync(() => {
    const mockTasks = {
      tasks: [
        {
          _id: '123',
          name: 'Test Task',
          description: 'Test Description',
          assignedTo: ['user1', 'user2'],
          projectId: '456',
          status: 'pending',
          endDate: '2023-12-31',
          startDate: '2023-12-31',
        },

        {
          _id: '2',
          name: 'Task 2',
          description: 'Test Description',
          assignedTo: ['user1', 'user2'],
          projectId: '457',
          status: 'in progress',
          endDate: '2023-12-31',
          startDate: '2023-12-31',
        },
        {
          _id: '3',
          name: 'Task 3',
          assignedTo: ['user1', 'user2'],
          projectId: '458',
          status: 'completed',
          endDate: '2023-12-31',
          startDate: '2023-12-31',
        },
      ],
    };
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks as any));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.todo[0]).toEqual(mockTasks.tasks[0] as any);
    expect(component.inProgress[0]).toEqual(mockTasks.tasks[1] as any);
    expect(component.done[0]).toEqual(mockTasks.tasks[2] as any);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error when loading tasks', () => {
    taskServiceSpy.getTasks.and.returnValue(
      throwError(() => new Error('Loading failed'))
    );
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith(
      'Error loading tasks',
      jasmine.any(Error)
    );
  });

  it('should update task status on drop', () => {
    const mockEvent: any = {
      previousContainer: {
        id: 'todo',
        data: [{ _id: '1', status: 'pending' }],
      },
      container: { id: 'in progress', data: [] },
      previousIndex: 0,
      currentIndex: 0,
    };
    taskServiceSpy.updateTaskStatus.and.returnValue(of({} as any));

    component.drop(mockEvent);

    expect(taskServiceSpy.updateTaskStatus).toHaveBeenCalledWith(
      '1',
      'in progress'
    );
  });

  it('should delete task when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    taskServiceSpy.deleteTask.and.returnValue(of({} as any));
    spyOn(component, 'loadTasks');

    component.deleteTask('1');

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    expect(component.loadTasks).toHaveBeenCalled();
  });

  it('should not delete task when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteTask('1');

    expect(taskServiceSpy.deleteTask).not.toHaveBeenCalled();
  });

  it('should handle error when deleting task', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    taskServiceSpy.deleteTask.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );
    spyOn(console, 'error');

    component.deleteTask('1');

    expect(console.error).toHaveBeenCalledWith(
      'Error deleting project',
      jasmine.any(Error)
    );
  });
});
