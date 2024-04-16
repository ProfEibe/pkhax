import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { EditorComponent } from './editor/editor.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editor',
    redirectTo: 'editor/',
    pathMatch: 'full',
  },
  {
    path: 'editor/:id',
    component: EditorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: DetailComponent,
  },
  {
    path: '',
    component: ListComponent,
  },
];
