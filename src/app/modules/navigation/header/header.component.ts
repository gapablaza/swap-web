import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  SearchService,
  Suggest,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Subscription,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { authFeature } from '../../auth/store/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    NgIf,
    NgFor,
    AsyncPipe,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  @ViewChild('suggestionInput', { static: true }) suggestInput!: ElementRef;
  suggests: Suggest[] = [];
  searchedText = '';
  showSuggests = false;
  isSearching = false;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  // isAuth = false;
  isAuth$ = this.store.select(authFeature.selectIsAuth);
  subs: Subscription = new Subscription();

  constructor(
    // private authSrv: AuthService,
    private store: Store,
    private searchSrv: SearchService,
    private router: Router,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.authSrv.isAuth.subscribe((authState) => {
    //   this.isAuth = authState;
    //   this.cdr.markForCheck();
    // });

    const focusoutSub = fromEvent(this.suggestInput.nativeElement, 'focusout')
      .pipe(delay(200))
      .subscribe(() => {
        this.showSuggests = false;
        this.cdr.markForCheck();
      });
    this.subs.add(focusoutSub);

    const focusSub = fromEvent(this.suggestInput.nativeElement, 'focus')
      .pipe(filter(() => (this.searchedText || '').trim().length >= 2))
      .subscribe(() => {
        this.showSuggests = true;
        this.cdr.markForCheck();
      });
    this.subs.add(focusSub);

    const keyupSub = fromEvent(this.suggestInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: any) => event.target.value),
        distinctUntilChanged(),
        tap((term) => {
          if ((term || '').trim().length < 2) {
            this.showSuggests = false;
            this.cdr.markForCheck();
          }
        }),
        filter((term) => (term || '').trim().length >= 2),
        tap(() => {
          this.isSearching = true;
          this.cdr.markForCheck();
        }),
        switchMap((term) => this.searchSrv.getSuggests(term))
      )
      .subscribe((suggs) => {
        this.suggests = [...suggs];

        this.isSearching = false;
        this.showSuggests = true;
        this.cdr.markForCheck();
      });
    this.subs.add(keyupSub);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  // onLogout() {
  //   this.authSrv.logout();
  // }

  onSearch() {
    if (this.searchedText.trim().length < 2) {
      this.uiSrv.showSnackbar('Debes ingresar al menos 2 caracteres');
      return;
    }

    this.router.navigate(['/search'], {
      queryParams: {
        q: this.searchedText,
      },
    });
    this.searchedText = '';
  }

  myEncodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
