import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskViewComponent } from './task-view.component';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskViewComponent', () => {
  let component: TaskViewComponent;
  let fixture: ComponentFixture<TaskViewComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockActivatedRoute: any;

  const mockTask: Task = {
    _id: '1',
    name: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    projectId: 'project1',
    startDate: new Date(),
    endDate: new Date(),
    assignedTo: ['user1', 'user2'] as any,
  };

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTask']);
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ id: '1' })),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, TaskViewComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task details on init', () => {
    mockTaskService.getTask.and.returnValue(of({ task: mockTask } as any));
    fixture.detectChanges();
    expect(component.taskId).toBe('1');
    expect(component.task).toEqual(mockTask);
    expect(mockTaskService.getTask).toHaveBeenCalledWith('1');
  });

  it('should handle error when loading task', () => {
    mockTaskService.getTask.and.returnValue(
      throwError(() => new Error('Error loading task'))
    );
    spyOn(console, 'error');
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith(
      'Error al cargar la tarea:',
      jasmine.any(Error)
    );
  });

  it('should not call getTask if taskId is null', () => {
    mockActivatedRoute.paramMap = of(convertToParamMap({}));
    fixture.detectChanges();
    expect(mockTaskService.getTask).not.toHaveBeenCalled();
  });


});
