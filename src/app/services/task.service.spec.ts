import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://ober-deploy.vercel.app/api/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a list of tasks', (done) => {
    const mockTasks: Task[] = [
      {
        _id: '1',
        name: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        assignedTo: [],
        projectId: '5',
        endDate: new Date(),
        startDate: new Date(),
      },
      {
        _id: '2',
        name: 'Task 2',
        description: 'Description 2',
        status: 'pending',
        assignedTo: [],
        projectId: '4',
        endDate: new Date(),
        startDate: new Date(),
      },
    ];

    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
      done();
    });

    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fetch a single task by ID', (done) => {
    const mockTask: Task = {
      _id: '1',
      name: 'Task 1',
      description: 'Description 1',
      status: 'pending',
      assignedTo: [],
      projectId: '5',
      endDate: new Date(),
      startDate: new Date(),
    };

    service.getTask('1').subscribe((task) => {
      expect(task).toEqual(mockTask);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should create a new task', (done) => {
    const newTask: Task = {
      _id: '3',
      name: 'Task 3',
      description: 'Description 3',
      status: 'pending',
      assignedTo: [],
      projectId: '5',
      endDate: new Date(),
      startDate: new Date(),
    };

    service.createTask(newTask).subscribe((task) => {
      expect(task).toEqual(newTask);
      done();
    });

    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('should update an existing task', (done) => {
    const updatedTask: Task = {
      _id: '1',
      name: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
      assignedTo: [],
      projectId: '5',
      endDate: new Date(),
      startDate: new Date(),
    };

    service.updateTask('1', updatedTask).subscribe((task) => {
      expect(task).toEqual(updatedTask);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should delete a task by ID', (done) => {
    service.deleteTask('1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update the status of a task', (done) => {
    const mockUpdatedTask: Task = {
      _id: '1',
      name: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
      assignedTo: [],
      projectId: '5',
      endDate: new Date(),
      startDate: new Date(),
    };

    service.updateTaskStatus('1', 'completed').subscribe((task) => {
      expect(task).toEqual(mockUpdatedTask);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/state/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'completed' });
    req.flush(mockUpdatedTask);
  });
});
