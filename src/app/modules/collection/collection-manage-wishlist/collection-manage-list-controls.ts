import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-collection-manage-list-controls',
  templateUrl: './collection-manage-list-controls.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class CollectionManageListControlsComponent {
  isSaving = input<boolean>(false);
  typeSelected = input.required<string>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onChangeMode = new EventEmitter<string>();
}
