import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import {TableModule} from 'primeng/table';
import {HttpClientModule} from '@angular/common/http';
import {RatingModule} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { EditorComponent } from './editor/editor.component';
import {InputTextModule} from 'primeng/inputtext';
import {EditorModule} from 'primeng/editor';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import { TopbarComponent } from './topbar/topbar.component';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {FieldsetModule} from 'primeng/fieldset';
import {ToastModule} from 'primeng/toast';
import {AuthModule} from '@auth0/auth0-angular';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailComponent,
    EditorComponent,
    TopbarComponent,
    AuthButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    RatingModule,
    InputTextModule,
    EditorModule,
    ButtonModule,
    CardModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    DropdownModule,
    CheckboxModule,
    InputNumberModule,
    TriStateCheckboxModule,
    FieldsetModule,
    ToastModule,
    OverlayPanelModule,
    MessagesModule,
    MessageModule,
    AuthModule.forRoot({
      domain: 'pkhax.eu.auth0.com',
      clientId: '7sWkLFfOuzg423qt9RK4QOXo2jTqeLcH'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
