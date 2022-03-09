import { Component, OnInit } from '@angular/core';

import { Collection, CollectionService, Media } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-media',
  templateUrl: './collection-media.component.html',
  styleUrls: ['./collection-media.component.scss']
})
export class CollectionMediaComponent implements OnInit {
  collection!: Collection;
  media: Media[] = [];
  showedImages: Media[] = [];
  searchText = '';
  // baseImageUrl = 'https://res.cloudinary.com/cambialaminas/image/upload/c_scale,q_auto,w_200/c_scale,e_grayscale,g_south_east,l_base:icono-logo-watermark-white,o_40,w_35,x_5,y_5/v1/prod/collectionMedia/';
  baseImageUrl = 'https://res.cloudinary.com/cambialaminas/image/upload/c_scale,q_auto,h_280/c_scale,e_grayscale,g_south_east,l_base:icono-logo-watermark-white,o_40,w_35,x_5,y_5/v1/prod/collectionMedia/';

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
  ) { }

  ngOnInit(): void {
    this.collection = this.colOnlySrv.getCurrentCollection();
    this.colSrv.getMedia(this.collection.id)
      .subscribe(data => {
        // media array is ordered by total Likes and creation time
        this.media = data
          .sort((a, b) => {
            return ((a.totalLikes || 0) > (b.totalLikes || 0) ? 1 : -1)
          });
        // .sort((a, b) => {
        //   return ((a.created > b.created) ? 1 : -1)
        // });

        // new array with only approved images
        this.showedImages = this.media
          .filter((elem: Media) => {
            return ((elem.mediaTypeId == 1) && (elem.mediaStatusId == 2)) ? true : false;
          });
      });
  }

  trackByImage(index: number, item: Media): number {
    return item.id;
  }

  onFilter() {
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      this.showedImages = this.media
        .filter((elem: Media) => {
          return ((elem.mediaTypeId == 1) && (elem.mediaStatusId == 2)) ? true : false;
        })
        .filter((elem: Media) => {
          return (elem.description.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
            || (elem.user.data.displayName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
        })
    }
  }
}
