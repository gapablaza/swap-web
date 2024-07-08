import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { authFeature } from '../auth/store/auth.state';

@Component({
  selector: 'app-collaborate',
  templateUrl: './collaborate.component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe],
})
export class CollaborateComponent {
  isLoading$ = this.store.select(authFeature.selectLoading);
  authUser$ = this.store.select(authFeature.selectUser);

  constructor(private store: Store) {}
}
