import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task/task-list/task-list.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { TaskViewComponent } from './components/task/task-view/task-view.component';
import { ProjectViewComponent } from './components/project/project-view/project-view.component';
import { ProjectEditComponent } from './components/project/project-edit/project-edit.component';
import { TaskEditComponent } from './components/task/task-edit/task-edit.component';
import { TaskCreateComponent } from './components/task/task-create/task-create.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks/:id/view',
    component: TaskViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks/:id/edit',
    component: TaskEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks/new',
    component: TaskCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/:id/edit',
    component: ProjectEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/:id/view',
    component: ProjectViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/new',
    component: ProjectCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
