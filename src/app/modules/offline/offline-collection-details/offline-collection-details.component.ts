import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    signal,
  } from '@angular/core';
  import { RouterLink } from '@angular/router';
  import { MatButtonModule } from '@angular/material/button';
  import { DatePipe } from '@angular/common';
  import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
  } from '@angular/material/dialog';
  
  import { Collection, Item } from 'src/app/core';
  import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
  import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
  
  @Component({
    selector: 'app-offline-collection-details',
    templateUrl: './offline-collection-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      DatePipe,
      RouterLink,
  
      MatButtonModule,
      MatDialogModule,
      
      SanitizeHtmlPipe,
      SlugifyPipe,
    ],
  })
  export class OfflineCollectionDetailsComponent {
    collection$ = signal<Collection>({} as Collection);
    userWishing: Item[] = [];
    userTrading: Item[] = [];
  
    constructor(
      private dialogRef: MatDialogRef<OfflineCollectionDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) data: any
    ) {
      this.collection$.set(data.collection);
      this.userWishing =
      [...(data.collection.userData?.wishlist || [])].sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      ) || [];
    this.userTrading =
      [...(data.collection.userData?.tradelist || [])].sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      ) || [];
    }

    onClose() {
      this.dialogRef.close();
    }
  }
  