import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { LinebreaksPipe } from 'src/app/shared';
import { newCollectionFeature } from '../store/new-collection.state';
import { DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { newCollectionActions } from '../store/new-collection.actions';

@Component({
  selector: 'app-new-collection-comments',
  templateUrl: './new-collection-comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    RouterLink,

    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,

    LinebreaksPipe,
  ],
})
export class NewCollectionCommentsComponent implements OnInit {
  comments$ = this.store.select(
    newCollectionFeature.selectNewCollectionCommentsOrdered
  );
  canComment$ = this.store.select(newCollectionFeature.selectCanComment);
  isLoaded$ = this.store.select(newCollectionFeature.selectIsCommentsLoaded);
  isProcessing$ = this.store.select(newCollectionFeature.selectIsProcessing);

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  commentForm = this.formBuilder.group({
    newComment: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(1000),
      ],
    ],
  });

  canComment = false;

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(newCollectionActions.loadComments());
  }

  onComment(): void {
    if (this.commentForm.invalid) return;

    let commentMsg = this.commentForm.get('newComment')?.value || '';
    this.store.dispatch(newCollectionActions.addComment({ commentMsg }));
  }
}
