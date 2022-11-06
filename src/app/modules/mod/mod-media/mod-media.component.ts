import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { map, take } from 'rxjs';
import { Media, MediaService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mod-media',
  templateUrl: './mod-media.component.html',
  styleUrls: ['./mod-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModMediaComponent implements OnInit {
  medias: Media[] = [];
  baseForModImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/v1/${environment.cloudinary.site}/collectionMedia/`;
  isSaving = false;
  isLoaded = false;

  constructor(
    private mediaSrv: MediaService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mediaSrv
      .waitingModeration()
      .pipe(
        // filter only images
        map((media) =>
          media.filter((elem: Media) => {
            return elem.mediaTypeId == 1;
          })
        ),
        take(1)
      )
      .subscribe((media) => {
        this.medias = media;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
  }

  onSanctionImage(mediaId: number, sanctionId: 2 | 3) {
    this.isSaving = true;

    this.mediaSrv
      .sanction(mediaId, sanctionId)
      .pipe(take(1))
      .subscribe({
        next: (message) => {
          this.medias.splice(
            this.medias.findIndex((elem) => {
              return elem.id == mediaId;
            }),
            1
          );
          this.uiSrv.showSuccess(message);
          this.isSaving = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.log('sanction error: ', error);
          this.uiSrv.showError(error.error.message);
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }
}
