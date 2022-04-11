import { Collection } from './collection.model';
import { User } from './user.model';

export class Media {
    public created: number;
    public description: string;
    public id: number;
    public likes?: boolean | null;
    public mediaStatusId: number;
    public mediaStatusName: string;
    public mediaTypeId: number;
    public mediaTypeName: string;
    public totalLikes?: number | null;
    public updated?: number | null;
    public url?: string | null;
    public user?: { // solo cuando se consultan las medias asociadas a una colección
        data: User;
    };
    public collection?: { // solo cuando se consultan las medias subidas por un usuario
      data: Collection;
    }

    constructor() {
      this.created = 0;
      this.description = '';
      this.id = 0;
      this.likes = null;
      this.mediaStatusId = 2;
      this.mediaStatusName = 'Publicado';
      this.mediaTypeId = 1;
      this.mediaTypeName = 'Imagen';
      this.totalLikes = null;
      this.updated = null;
      this.url = null;
      // this.user = { data: {} as User };
    }
}
