import { Collection } from './collection.model';
import { User } from './user.model';

export interface Media {
    created: number,
    description: string,
    id: number,
    likes?: boolean,
    mediaStatusId: number,
    mediaStatusName: string,
    mediaTypeId: number,
    mediaTypeName: string,
    totalLikes?: number | null,
    updated?: number | null,
    url?: string | null,
    user?: { // solo cuando se consultan las medias asociadas a una colección
        data: User,
    },
    collection?: { // solo cuando se consultan las medias subidas por un usuario
      data: Collection,
    }
}

export interface MediaUpload {
  description: string,
  url: string | null,
  mediaTypeId: 1 | 2 | 3 | 4,
  collectionId: number,
}
