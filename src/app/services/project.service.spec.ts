import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://ober-deploy.vercel.app/api/projects';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a list of projects', (done) => {
    const mockProjects: Project[] = [
      { _id: '1', name: 'Project 1', users: [], tasks: [] },
      { _id: '2', name: 'Project 2', users: [], tasks: [] },
    ];

    service.getProjects().subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}?limit=100&skip=0`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('should fetch a single project by ID', (done) => {
    const mockProject: Project = {
      _id: '1',
      name: 'Project 1',
      users: [],
      tasks: [],
    };

    service.getProject('1').subscribe((project) => {
      expect(project).toEqual(mockProject);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProject);
  });

  it('should create a new project', (done) => {
    const newProject: Project = {
      _id: '3',
      name: 'Project 3',
      users: [],
      tasks: [],
    };

    service.createProject(newProject).subscribe((project) => {
      expect(project).toEqual(newProject);
      done();
    });

    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProject);
    req.flush(newProject);
  });

  it('should update an existing project', (done) => {
    const updatedProject: Project = {
      _id: '1',
      name: 'Updated Project',
      users: [],
      tasks: [],
    };

    service.updateProject('1', updatedProject).subscribe((project) => {
      expect(project).toEqual(updatedProject);
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProject);
    req.flush(updatedProject);
  });

  it('should delete a project by ID', (done) => {
    service.deleteProject('1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${mockApiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
