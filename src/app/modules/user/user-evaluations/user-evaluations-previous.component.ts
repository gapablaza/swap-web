import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { DEFAULT_USER_PROFILE_IMG, Evaluation } from 'src/app/core';

@Component({
  selector: 'app-user-evaluations-previous',
  templateUrl: './user-evaluations-previous.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    DatePipe,

    MatDialogModule,
    MatButtonModule,
    LazyLoadImageModule,
  ],
})
export class UserEvaluationsPreviousComponent {
  evaluations: Evaluation[] = [];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  constructor(
    private dialogRef: MatDialogRef<UserEvaluationsPreviousComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.evaluations = data.evaluations;
  }

  onClose() {
    this.dialogRef.close();
  }
}
