import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Collection,
  Evaluation,
  EvaluationsApiResponse,
  Media,
  TradesWithUser,
  User,
} from 'src/app/core';

export const userActions = createActionGroup({
  source: 'User',
  events: {
    'Clean User Data': emptyProps(),
    'Set User Data': props<{ user: User }>(),

    'Load User Data': props<{ userId: number }>(),
    'Load User Data Success': props<{ user: User }>(),
    'Load User Data Failure': props<{ error: string }>(),

    'Load Trades With Auth User': emptyProps(),
    'Load Trades With Auth User Success': props<{
      tradesWithUser: TradesWithUser;
    }>(),
    'Load Trades With Auth User Failure': props<{ error: string }>(),

    'Load User Collections': emptyProps,
    'Load User Collections Success': props<{ collections: Collection[] }>(),
    'Load User Collections Failure': props<{ error: string }>(),

    'Load User Collection Details': props<{ collection: Collection }>(),
    'Load User Collection Details Success': props<{ collection: Collection }>(),
    'Load User Collection Details Failure': props<{ error: string }>(),

    'Toggle Blacklist': props<{ blacklist: boolean }>(),
    'Toggle Blacklist Success': props<{
      blacklist: boolean;
      message: string;
    }>(),
    'Toggle Blacklist Failure': props<{ error: string }>(),

    'Load User Evaluations': emptyProps(),
    'Load User Evaluations Success': props<{
      evaluationsData: EvaluationsApiResponse;
    }>(),
    'Load User Evaluations Failure': props<{ error: string }>(),

    'Add Evaluation': props<{ typeId: number; comment: string }>(),
    'Add Evaluation Success': props<{ message: string }>(),
    'Add Evaluation Failure': props<{ error: string }>(),

    'Load User Media': emptyProps(),
    'Load User Media Success': props<{ media: Media[] }>(),
    'Load User Media Failure': props<{ error: string }>(),

    'Toggle Media Like': props<{ mediaId: number; likes: boolean }>(),
    'Toggle Media Like Success': props<{
      mediaId: number;
      likes: boolean;
      message: string;
    }>(),
    'Toggle Media Like Failure': props<{ error: string }>(),
  },
});