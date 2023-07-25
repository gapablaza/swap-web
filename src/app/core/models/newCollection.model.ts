import { Image } from './image.model';
import { Publisher } from './publisher.model';
import { User } from './user.model';

export interface NewCollection {
  checklistDescription: string | null;
  checklistId: number | null;
  cover?: {
    data: Image | null
  };
  created: number;
  description: string | null;
  id: number;
  image: {
    data: Image | null
  };
  name: string;
  publisher: {
    data: Publisher
  };
  released?: string | null;
  statusId: number;
  statusName: string;
  updated: number;
  user: {
    data: User | null
  };
  year: number;

  // Campos utilizados al listar
  relevance?: number;
  checklistsQty?: number;
  votesQty?: number;
}
