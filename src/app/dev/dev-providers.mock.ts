import { EnvironmentProviders, Provider } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, map, of } from 'rxjs';

/**
 * Mock mode for local testing without Auth0 and without writing to the production API.
 * - AuthService is replaced by a fake that is logged in as "auth0|mock" (toggle with the topbar login/logout buttons).
 * - All reads are proxied to the real API; all writes and `/user` are answered locally.
 * Never part of a production build (wired via fileReplacements in angular.json).
 */
const MOCK_SUB = 'auth0|mock';
const mockUser = { id: 1, auth0Id: MOCK_SUB, displayName: 'MockUser' };
let nextId = 900000;

class MockAuthService {
  private loggedIn$ = new BehaviorSubject(true);
  isLoading$ = of(false);
  isAuthenticated$ = this.loggedIn$.asObservable();
  user$ = this.loggedIn$.pipe(
    map((loggedIn) => (loggedIn ? { sub: MOCK_SUB, name: 'Mock User', picture: 'favicon.ico' } : null)),
  );
  error$ = of();
  loginWithRedirect() {
    this.loggedIn$.next(true);
    return of(undefined);
  }
  logout() {
    this.loggedIn$.next(false);
    return of(undefined);
  }
  getAccessTokenSilently() {
    return of('mock-token');
  }
}

const mockWrites: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace(/^.*\/api/, '');
  const body = (req.body ?? {}) as Record<string, unknown>;
  const reply = (data: unknown) => {
    console.warn(`[mock] ${req.method} ${req.url}`, data);
    return of(new HttpResponse({ status: 200, body: data }));
  };
  const now = new Date().toISOString();

  if (url === '/user') {
    return reply(req.method === 'PUT' ? { ...mockUser, ...body } : mockUser);
  }
  if (req.method === 'GET') {
    return next(req);
  }
  if (req.method === 'POST' && /^\/ratings\/\d+$/.test(url)) {
    return reply({ id: nextId++, value: body['value'], created_by: mockUser });
  }
  if (req.method === 'POST' && /^\/games\/\d+\/comments(\/\d+)?$/.test(url)) {
    return reply({
      ...body,
      id: nextId++,
      children: [],
      created_at: now,
      modified_at: now,
      created_by: mockUser,
      modified_by: mockUser,
    });
  }
  if (req.method === 'POST' && url === '/games/') {
    return reply({ ...body, id: nextId++ });
  }
  if (req.method === 'PUT' && /^\/games\/\d+$/.test(url)) {
    return reply(body);
  }
  return reply({});
};

export const devProviders: (Provider | EnvironmentProviders)[] = [{ provide: AuthService, useClass: MockAuthService }];
export const devInterceptors: HttpInterceptorFn[] = [mockWrites];
