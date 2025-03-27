import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TaskManagerComponent } from './task-manager/task-manager.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Login page
  { path: 'main', component: TaskManagerComponent }, // Task Manager page
];
