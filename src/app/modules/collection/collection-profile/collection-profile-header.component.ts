import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';

@Component({
  selector: 'app-collection-profile-header',
  templateUrl: 'collection-profile-header.component.html',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionProfileHeaderComponent {
  @Input() collection!: Collection;
  @Input() isAuth = false;
  @Input() isProcessing = false;
  @Output() onAdd = new EventEmitter<void>();
  @Output() onConfirmDelete = new EventEmitter<void>();
  @Output() onComplete = new EventEmitter<boolean>();
  @Output() onShare = new EventEmitter<void>();

  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  dialog = inject(MatDialog);

  get isCollecting() {
    return this.collection.userData?.collecting == true ? true : false;
  }

  get isCompleted() {
    return this.collection.userData?.completed == true ? true : false;
  }

  onDelete() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }
}
