import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationError, provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideOptimus } from '@openng/optimus-ui/config';
import { MatomoTracker, provideMatomo, withRouter } from 'ngx-matomo-client';
import { authHttpInterceptorFn, HttpInterceptorRouteConfig, HttpMethod, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { MyPreset } from './my-preset';
import { devInterceptors, devProviders } from './dev/dev-providers';

const AUTH_AUDIENCE = 'https://pkhax.eu.auth0.com/api/v2/';
const AUTH_SCOPE = 'read:current_user';

/**
 * After a new deployment, an open tab may try to lazy-load a chunk that no longer exists.
 * Instead of a dead navigation, load the target URL fresh (this also fetches the new index.html).
 * Only once per minute, so a really broken deployment cannot cause a reload loop.
 */
function reloadOnMissingChunk(event: NavigationError): void {
  const message = String(event.error?.message ?? event.error);
  if (!/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(message)) {
    return;
  }
  const key = 'pkhax-chunk-reload';
  try {
    const last = Number(sessionStorage.getItem(key));
    if (last && Date.now() - last < 60_000) {
      console.error('Lazy chunk still missing after reload', event.error);
      return;
    }
    sessionStorage.setItem(key, String(Date.now()));
  } catch {
    // sessionStorage unavailable – reload anyway
  }
  window.location.assign(event.url);
}

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
    provideZonelessChangeDetection(),
    provideRouter(routes, withNavigationErrorHandler(reloadOnMissingChunk)),
    provideHttpClient(withFetch(), withInterceptors([...devInterceptors, authHttpInterceptorFn])),
    provideAnimationsAsync(),
    provideOptimus({
      theme: {
        preset: MyPreset,
        // Optimus UI styles go into a CSS layer below Tailwind utilities, so classes like
        // `md:hidden` or `fixed` on Optimus components are not overridden by the theme.
        options: { darkModeSelector: '.app-dark', cssLayer: { name: 'optimus', order: 'theme, base, optimus' } },
      },
    }),
    provideMatomo(
      // only count real visits, not local development
      { trackerUrl: 'https://jakos.uber.space/matomo', siteId: '4', disabled: !environment.production },
      withRouter(),
    ),
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
    ...devProviders,
  ],
};
