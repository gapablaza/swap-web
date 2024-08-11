import { Image } from './image.model';
import { Publisher } from './publisher.model';
import { User } from './user.model';

export interface NewCollection {
  checklistDescription: string | null;
  checklistId: number | null;
  cover: {
    data: Image | null
  };
  created: number;
  description: string | null;
  details: string | null;
  id: number;
  image: {
    data: Image | null
  };
  name: string;
  publisher: {
    data: Publisher
  };
  released?: string | null;
  statusComment?: string | null;
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

export interface NewChecklist {
  created: number;
  items: ChecklistItem[];
  id: number;
  updated: number;
  user: {
    data: User
  }
}

export interface ChecklistItem {
  name: string;
  itemTypeId?: number;
  description?: string;
  section?: string;
  position?: number;

  itemTypeDescription?: string;
}

export interface NewCollectionComment {
  comment: string;
  created: number;
  id: number;
  updated: number;
  user: {
    data: User
  }
}

export interface NewCollectionForm {
  id?: number;
  name: string;
  year: number;
  released?: string;
  publisher: number;
  description: string;
  details?: string;
  numbers?: string;
  image: number;
  cover?: number;
}
