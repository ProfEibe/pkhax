import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalFilterService {
  filter = signal<string>('');

  addFilter(data: string): void {
    this.filter.set(data);
  }
}
