import { Collection } from './collection.model';
import { User } from './user.model';

export interface Media {
    created: number,
    description: string,
    id: number,
    likes?: boolean | null,
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
