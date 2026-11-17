import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ListComponent } from './list/list.component';
import { AppLayout } from './layout/component/app.layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: 'user',
        loadComponent: () => import('./user/user.component').then((m) => m.UserComponent),
        canActivate: [AuthGuard],
      },
      {
        // old/duplicate URL of the list
        path: 'list',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'editor',
        redirectTo: 'editor/',
        pathMatch: 'full',
      },
      {
        path: 'editor/:id',
        loadComponent: () => import('./editor/editor.component').then((m) => m.EditorComponent),
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        loadComponent: () => import('./detail/detail.component').then((m) => m.DetailComponent),
      },
      {
        path: '',
        component: ListComponent,
      },
    ],
  },
];
