import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';
import {EditorComponent} from './editor/editor.component';
import {AuthGuard} from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: 'editor',
    redirectTo: 'editor/',
    pathMatch: 'full'
  },
  {
    path: 'editor/:id',
    component: EditorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: DetailComponent
  },
  {
    path: '',
    component: ListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
