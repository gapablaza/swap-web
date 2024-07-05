import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-collection-manage-form',
  templateUrl: './collection-manage-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class CollectionManageFormComponent implements OnChanges {
  @Input() publicComment = '';
  @Input() isProcessing = false;
  @Output() onAddComment = new EventEmitter<string>();
  @Output() onDeleteComment = new EventEmitter();
  commentForm = this.formBuilder.group({
    comment: [
      this.publicComment || '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(250)],
    ],
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['publicComment']) {
      this.commentForm.patchValue({ comment: this.publicComment });
    }
  }

  get form() {
    return this.commentForm.controls;
  }
}
