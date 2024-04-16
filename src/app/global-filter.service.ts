import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalFilterService {
  private filter: Subject<string> = new BehaviorSubject('');

  get filter$(): Observable<string> {
    return this.filter.asObservable();
  }

  addFilter(data: string): void {
    this.filter.next(data);
  }
}
