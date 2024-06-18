import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, Subscription, tap } from 'rxjs';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Store } from '@ngrx/store';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { AdsModule } from 'src/app/shared/ads.module';
import { UIService } from 'src/app/shared';
import { authFeature } from '../../auth/store/auth.state';
import { messagesFeature } from '../store/message.state';
import { messagesActions } from '../store/message.actions';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AdsModule,
    NgClass,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    LazyLoadImageModule,
    DatePipe,
    AsyncPipe,
  ],
})
export class MessageListComponent implements OnInit, OnDestroy {
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  messages: any[] = [];
  showedMessages: any[] = [];

  authUser$ = this.store.select(authFeature.selectUser);
  messages$ = this.store.select(messagesFeature.selectMessages);

  searchText = '';
  typeSelected = '1';

  showFilters = true;
  isAdsLoaded = false;
  loading$ = this.store.select(messagesFeature.selectLoading);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(messagesActions.loadConversations());

    let messagesSub = combineLatest([this.authUser$, this.messages$])
      .pipe(
        tap(([authUser, messages]) => {
          if (authUser.accountTypeId == 1) {
            this.loadAds();
          }
        }),
        map(([authUser, messages]) => {
          return messages.map((payload) => {
            return {
              withUserId:
                payload.toUserId == authUser.id
                  ? payload.fromUserId
                  : payload.toUserId,
              withUserName:
                payload.toUserId == authUser.id
                  ? payload.fromUserName
                  : payload.toUserName,
              withUserImage:
                payload.toUserId == authUser.id
                  ? payload.fromUserImage
                  : payload.toUserImage,
              withUserText: payload.body,
              withUserTime: payload.timestamp,
              fromAuthUser: payload.fromUserId == authUser.id ? true : false,
              unread: payload.unread === false ? false : true,
              archived: payload.archived === true ? true : false,
            };
          });
        })
      )
      .subscribe((list) => {
        this.messages = list;
        this.filterShowedMessages();
        this.cdr.markForCheck();
      });
    this.subs.add(messagesSub);
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  onFilter() {
    this.filterShowedMessages();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedMessages();
  }

  filterShowedMessages() {
    let tempMessages = this.messages;
    let type = parseInt(this.typeSelected);

    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempMessages = [
        ...this.messages.filter((elem: any) => {
          return (
            elem.withUserName
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.withUserId
              .toString()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.withUserText
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }

    // 2.- check filter by evaluation type
    if (type) {
      tempMessages = [
        ...tempMessages.filter((elem) => {
          return type == 1 ? !elem.archived : elem.archived;
        }),
      ];
    }

    this.showedMessages = [...tempMessages.reverse()];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(messagesActions.loadConversationsDestroy());
  }
}
