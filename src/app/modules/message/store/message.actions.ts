import {
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';

import { Message, User } from 'src/app/core';

export const messagesActions = createActionGroup({
  source: 'Messages',
  events: {
    'Load Conversations': emptyProps(),
    'Load Conversations Success': props<{ messages: Message[] }>(),
    'Load Conversations Failure': props<{ error: string }>(),
    'Load Conversations Destroy': emptyProps(),

    'Load One Conversation': props<{ otherUserId: number }>(),
    'Load One Conversation Success': props<{ otherUserId: number, conversation: Message[] }>(),
    'Load One Conversation Failure': props<{ error: string }>(),
    'Load One Conversation Destroy': emptyProps(),

    'Clean Unreads': props<{ otherUserId: number }>(),
    'Clean Unreads Success': emptyProps(),
    'Clean Unreads Failure': props<{ error: string }>(),
    'Clean Unreads Destroy': emptyProps(),

    'Conversation Is Archived': props<{ otherUserId: number }>(),
    'Conversation Is Archived Success': props<{ isArchived: boolean }>(),
    'Conversation Is Archived Failure': props<{ error: string }>(),
    'Conversation Is Archived Destroy': emptyProps(),

    'Archive Conversation': props<{ otherUserId: number }>(),
    'Archive Conversation Success': emptyProps(),
    'Archive Conversation Failure': props<{ error: string }>(),

    'Send Message': props<{ otherUser: User, message: string }>(),
    'Send Message Success': emptyProps(),
    'Send Message Failure': props<{ error: string }>(),
  },
});
