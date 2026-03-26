import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { authHttpInterceptorFn, HttpMethod, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { MyPreset } from './my-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authHttpInterceptorFn])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } },
    }),
    provideMatomo({ trackerUrl: 'https://jakos.uber.space/matomo', siteId: '4' }, withRouter()),
    provideAuth0({
      domain: 'pkhax.eu.auth0.com',
      clientId: '7sWkLFfOuzg423qt9RK4QOXo2jTqeLcH',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      cacheLocation: 'localstorage',

      // Request this audience at user authentication time
      //audience: 'https://pkhax.eu.auth0.com/api/v2/',
      // Request this scope at user authentication time
      //scope: 'read:current_user',
      // Specify configuration for the interceptor
      httpInterceptor: {
        allowedList: [
          {
            // Match any request starting with /api
            uri: '/api/*',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://pkhax.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
              },
            },
            // Apply to all methods
          },
        ],
      },
    }),
  ],
};
