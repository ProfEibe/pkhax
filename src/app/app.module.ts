import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ListComponent} from './list/list.component';
import {TableModule} from 'primeng/table';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RatingModule} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {DetailComponent} from './detail/detail.component';
import {EditorComponent} from './editor/editor.component';
import {InputTextModule} from 'primeng/inputtext';
import {EditorModule} from 'primeng/editor';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {FieldsetModule} from 'primeng/fieldset';
import {ToastModule} from 'primeng/toast';
import {AuthHttpInterceptor, AuthModule, HttpMethod} from '@auth0/auth0-angular';
import {AuthButtonComponent} from './auth-button/auth-button.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {RatingComponent} from './detail/rating/rating.component';
import {RippleModule} from 'primeng/ripple';
import {DividerModule} from 'primeng/divider';
import {ContextMenuModule} from 'primeng/contextmenu';
import {CommentComponent} from './detail/comment/comment.component';
import {environment} from '../environments/environment';
import { UserComponent } from './user/user.component';
import {AvatarModule} from 'primeng/avatar';
import {GalleriaModule} from 'primeng/galleria';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule} from 'ngx-google-analytics';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {AppTopBarComponent} from './app.topbar.component';
import {AppMainComponent} from './app.main.component';
import {AppFooterComponent} from './app.footer.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ConfigService} from './service/app.config.service';
import {MenuService} from './service/app.menu.service';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'pkhax.com'
  },
  position: 'bottom-right',
  theme: 'classic',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#f1d600',
      text: '#000000',
      border: 'transparent'
    }
  },
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'https://cookiesandyou.com',
    policy: 'Cookie Policy'
  }
};

@NgModule({
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
    DividerModule,
    RatingModule,
    ContextMenuModule,
    RippleModule,
    AvatarModule,
    GalleriaModule,
    InputTextareaModule,
    NgxGoogleAnalyticsModule.forRoot('G-KP19D747BT'),
    NgxGoogleAnalyticsRouterModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    AuthModule.forRoot({
      // The domain and clientId were configured in the previous chapter
      domain: 'pkhax.eu.auth0.com',
      clientId: '7sWkLFfOuzg423qt9RK4QOXo2jTqeLcH',

      // Request this audience at user authentication time
      audience: 'https://pkhax.eu.auth0.com/api/v2/',

      // Request this scope at user authentication time
      scope: 'read:current_user',

      // Specify configuration for the interceptor
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://pkhax.eu.auth0.com/api/v2/' (note the asterisk)
            uri: environment.baseUrl + '/games/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://pkhax.eu.auth0.com/api/v2/',

              // The attached token should have these scopes
              scope: 'read:current_user'
            },
            httpMethod: HttpMethod.Post
          },
          {
            uri: environment.baseUrl + '/games/*',
            tokenOptions: {
              audience: 'https://pkhax.eu.auth0.com/api/v2/',
              scope: 'read:current_user'
            },
            httpMethod: HttpMethod.Put
          },
          {
            uri: environment.baseUrl + '/user',
            tokenOptions: {
              audience: 'https://pkhax.eu.auth0.com/api/v2/',
              scope: 'read:current_user'
            },
            httpMethod: HttpMethod.Get
          },
          {
            uri: environment.baseUrl + '/user',
            tokenOptions: {
              audience: 'https://pkhax.eu.auth0.com/api/v2/',
              scope: 'read:current_user'
            },
            httpMethod: HttpMethod.Put
          },
          {
            uri: environment.baseUrl + '/ratings/*',
            tokenOptions: {
              audience: 'https://pkhax.eu.auth0.com/api/v2/',
              scope: 'read:current_user'
            },
            httpMethod: HttpMethod.Post
          }
        ]
      }
    }),
    InputSwitchModule,
    RadioButtonModule,
    NgxMatomoTrackerModule.forRoot({ trackerUrl: 'https://jakos.uber.space/matomo', siteId: '4' }),
    NgxMatomoRouterModule,
  ],
  declarations: [
    AppComponent,
    AppMainComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    ListComponent,
    DetailComponent,
    EditorComponent,
    AuthButtonComponent,
    RatingComponent,
    CommentComponent,
    UserComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
    ConfigService, MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
