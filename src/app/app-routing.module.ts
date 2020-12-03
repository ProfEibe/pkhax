import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';
import {EditorComponent} from './editor/editor.component';

const routes: Routes = [
  {
    path: 'editor',
    redirectTo: 'editor/',
    pathMatch: 'full'
  },
  {
    path: 'editor/:id',
    component: EditorComponent
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
