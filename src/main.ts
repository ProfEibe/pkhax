import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GalleriaModule } from 'primeng/galleria';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AuthHttpInterceptor, AuthModule, HttpMethod } from '@auth0/auth0-angular';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, TableModule, RatingModule, InputTextModule, EditorModule, ButtonModule, CardModule, MultiSelectModule, DropdownModule, CheckboxModule, InputNumberModule, TriStateCheckboxModule, FieldsetModule, ToastModule, OverlayPanelModule, MessagesModule, MessageModule, DividerModule, RatingModule, ContextMenuModule, RippleModule, AvatarModule, GalleriaModule, InputTextareaModule, NgxGoogleAnalyticsModule.forRoot('G-KP19D747BT'), NgxGoogleAnalyticsRouterModule,
        //NgcCookieConsentModule.forRoot(cookieConfig),
        AuthModule.forRoot({
            // The domain and clientId were configured in the previous chapter
            domain: 'pkhax.eu.auth0.com',
            clientId: '7sWkLFfOuzg423qt9RK4QOXo2jTqeLcH',
            // Request this audience at user authentication time
            //audience: 'https://pkhax.eu.auth0.com/api/v2/',
            // Request this scope at user authentication time
            //scope: 'read:current_user',
            // Specify configuration for the interceptor
            httpInterceptor: {
                allowedList: [
                    {
                        // Match any request that starts 'https://pkhax.eu.auth0.com/api/v2/' (note the asterisk)
                        uri: environment.baseUrl + '/games/*',
                        tokenOptions: {
                            authorizationParams: {
                                // The attached token should target this audience
                                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                                // The attached token should have these scopes
                                scope: 'read:current_user'
                            }
                        },
                        httpMethod: HttpMethod.Post
                    },
                    {
                        uri: environment.baseUrl + '/games/*',
                        tokenOptions: {
                            authorizationParams: {
                                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                                scope: 'read:current_user'
                            }
                        },
                        httpMethod: HttpMethod.Put
                    },
                    {
                        uri: environment.baseUrl + '/user',
                        tokenOptions: {
                            authorizationParams: {
                                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                                scope: 'read:current_user'
                            }
                        },
                        httpMethod: HttpMethod.Get
                    },
                    {
                        uri: environment.baseUrl + '/user',
                        tokenOptions: {
                            authorizationParams: {
                                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                                scope: 'read:current_user'
                            }
                        },
                        httpMethod: HttpMethod.Put
                    },
                    {
                        uri: environment.baseUrl + '/ratings/*',
                        tokenOptions: {
                            authorizationParams: {
                                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                                scope: 'read:current_user'
                            }
                        },
                        httpMethod: HttpMethod.Post
                    }
                ]
            }
        })),
        { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
