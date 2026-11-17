import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { MatomoTracker, provideMatomo, withRouter } from 'ngx-matomo-client';
import { authHttpInterceptorFn, HttpInterceptorRouteConfig, HttpMethod, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { MyPreset } from './my-preset';

const AUTH_AUDIENCE = 'https://pkhax.eu.auth0.com/api/v2/';
const AUTH_SCOPE = 'read:current_user';

/**
 * Requests that need an access token. Matched against the full request URL, so the
 * patterns must be built from `environment.baseUrl` (absolute in production, `/api` in dev).
 * Anonymous reads (games, comments, choice lists) intentionally get no token.
 */
const api = environment.baseUrl;
const authenticatedRoutes: HttpInterceptorRouteConfig[] = [
  { uri: `${api}/user`, httpMethod: HttpMethod.Get },
  { uri: `${api}/user`, httpMethod: HttpMethod.Put },
  { uri: `${api}/*`, httpMethod: HttpMethod.Post },
  { uri: `${api}/*`, httpMethod: HttpMethod.Put },
  { uri: `${api}/*`, httpMethod: HttpMethod.Delete },
].map((route) => ({
  ...route,
  tokenOptions: { authorizationParams: { audience: AUTH_AUDIENCE, scope: AUTH_SCOPE } },
}));

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authHttpInterceptorFn])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } },
    }),
    provideMatomo({ trackerUrl: 'https://jakos.uber.space/matomo', siteId: '4' }, withRouter()),
    // Cookieless tracking: must be queued before the first page view (sent on first NavigationEnd).
    provideAppInitializer(() => inject(MatomoTracker).disableCookies()),
    provideAuth0({
      domain: 'pkhax.eu.auth0.com',
      clientId: '7sWkLFfOuzg423qt9RK4QOXo2jTqeLcH',
      authorizationParams: {
        redirect_uri: window.location.origin,
        // Request the API audience at login (as in v1), so API tokens come from the login
        // response instead of a silent iframe call, which fails with third-party cookie blocking.
        audience: AUTH_AUDIENCE,
        scope: `openid profile email ${AUTH_SCOPE}`,
      },
      cacheLocation: 'localstorage',
      httpInterceptor: { allowedList: authenticatedRoutes },
    }),
  ],
};
