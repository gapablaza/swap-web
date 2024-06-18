import { createFeature, createReducer, on } from '@ngrx/store';

import { Message } from 'src/app/core';
import { messagesActions } from './message.actions';

interface State {
  messages: Message[];

  conversation: Message[];
  otherUserId: number | null;
  isArchived: boolean;

  loading: boolean;
  error: string | null;
}

const initialState: State = {
  messages: [],

  conversation: [],
  otherUserId: null,
  isArchived: false,

  loading: false,
  error: null,
};

export const messagesFeature = createFeature({
  name: 'messages',
  reducer: createReducer(
    initialState,

    on(messagesActions.loadConversations, (state) => ({
      ...state,
      loading: true,
    })),
    on(messagesActions.loadConversationsSuccess, (state, { messages }) => ({
      ...state,
      messages: [...messages],
      loading: false,
    })),
    on(messagesActions.loadConversationsFailure, (state) => ({
      ...state,
      loading: false,
    })),
    on(messagesActions.loadConversationsDestroy, (state) => ({
      ...state,
      messages: [],
    })),

    on(messagesActions.loadOneConversation, (state, { otherUserId }) => ({
      ...state,
      conversation: [],
      otherUserId,
      isArchived: false,
      loading: true,
    })),
    on(
      messagesActions.loadOneConversationSuccess,
      (state, { conversation }) => ({
        ...state,
        conversation: [...conversation],
        loading: false,
      })
    ),
    on(messagesActions.loadOneConversationFailure, (state) => ({
      ...state,
      loading: false,
    })),
    on(messagesActions.loadOneConversationDestroy, (state) => ({
      ...state,
      conversation: [],
      otherUserId: null,
    })),
    on(
      messagesActions.conversationIsArchivedSuccess,
      (state, { isArchived }) => ({
        ...state,
        isArchived,
      })
    )
  ),
});
