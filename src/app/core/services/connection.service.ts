import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ConnectionService {
  private connectionStatus$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    // Merge online and offline events and subscribe to them
    merge(online$, offline$).subscribe(this.connectionStatus$);
  }

  // Expose connection status as observable
  get isOnline$(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }
}
