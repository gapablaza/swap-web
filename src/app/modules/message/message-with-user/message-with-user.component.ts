import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { authFeature } from '../../auth/store/auth.state';
import { messagesFeature } from '../store/message.state';
import { messagesActions } from '../store/message.actions';

@Component({
  selector: 'app-message-with-user',
  templateUrl: './message-with-user.component.html',
  styleUrls: ['./message-with-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    LazyLoadImageModule,
    MatMenuModule,
    NgClass,
    FormsModule,
    DatePipe,
    AsyncPipe,
  ],
})
export class MessageWithUserComponent implements OnInit, OnDestroy {
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  newMessageText = '';
  otherUser = this.route.snapshot.data['userData'] as User;

  authUser$ = this.store.select(authFeature.selectUser);
  conversation$ = this.store.select(messagesFeature.selectConversation);
  usersMessages$ = combineLatest([this.authUser$, this.conversation$]).pipe(
    map(([authUser, conversation]) => conversation)
  );
  isArchived$ = this.store.select(messagesFeature.selectIsArchived);
  loading$ = this.store.select(messagesFeature.selectLoading);

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(
      messagesActions.loadOneConversation({ otherUserId: this.otherUser.id })
    );
  }

  onArchive() {
    this.store.dispatch(
      messagesActions.archiveConversation({ otherUserId: this.otherUser.id })
    );
  }

  onSend() {
    if (this.newMessageText.trim().length == 0) {
      return;
    }

    this.store.dispatch(
      messagesActions.sendMessage({
        otherUser: this.otherUser,
        message: this.newMessageText.trim().substring(0, 500),
      })
    );

    this.newMessageText = '';
  }

  ngOnDestroy(): void {
    this.store.dispatch(messagesActions.loadOneConversationDestroy());
  }
}
