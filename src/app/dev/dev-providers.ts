import { EnvironmentProviders, Provider } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Extension point for local development. Empty in normal builds; replaced by
 * `dev-providers.mock.ts` in the `mock` configuration (`npm run start:mock`).
 */
export const devProviders: (Provider | EnvironmentProviders)[] = [];
export const devInterceptors: HttpInterceptorFn[] = [];
