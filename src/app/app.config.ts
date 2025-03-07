import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { AuthHttpInterceptor, HttpMethod, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
    }),
    provideMatomo({ trackerUrl: 'https://jakos.uber.space/matomo', siteId: '4' }, withRouter()),
    provideAuth0({
      domain: 'pkhax.eu.auth0.com',
      clientId: '7sWkLFfOuzg423qt9RK4QOXo2jTqeLcH',
      authorizationParams: {
        redirect_uri: window.location.href,
      },

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
                scope: 'read:current_user',
              },
            },
            httpMethod: HttpMethod.Post,
          },
          {
            uri: environment.baseUrl + '/games/*',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
              },
            },
            httpMethod: HttpMethod.Put,
          },
          {
            uri: environment.baseUrl + '/user',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
              },
            },
            httpMethod: HttpMethod.Get,
          },
          {
            uri: environment.baseUrl + '/user',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
              },
            },
            httpMethod: HttpMethod.Put,
          },
          {
            uri: environment.baseUrl + '/ratings/*',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
              },
            },
            httpMethod: HttpMethod.Post,
          },
        ],
      },
    }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
};
