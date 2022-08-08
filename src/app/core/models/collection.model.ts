import { Item } from './item.model';
import { Publisher } from './publisher.model';

export interface CollectionUserData {
  collecting: boolean; //OK COLECCION
  completed?: boolean; //OK COLLECION DEL USUARIO
  wishing?: number; //OK COLLECION DEL USUARIO
  trading?: number; //OK COLLECION DEL USUARIO
  
  updated?: string; // USER COLLECTION DETAILS
  tradelist?: Item[]; // USER COLLECTION DETAILS
  wishlist?: Item[]; // USER COLLECTION DETAILS
}

export interface CollectionUserSummary { // OK - PERFIL USUARIO
  wishing: number;
  trading: number;
  completed: boolean;
  progress: number;
  created: string;
  updated: string;
}

export interface Collection {
  created: string; //OK - CON TZ
  description: string | null; //OK
  id: number; //OK
  image: string; //OK
  items: number; //OK
  name: string; //OK
  publisher: {
    data: Publisher;
  };
  release: string; //OK - SIN TZ
  updated?: string; //OK - CON TZ
  year: number; //OK

  totalCollecting?: number; //OK
  totalMedia?: number; //OK COLECCION

  recentCollecting?: number; //SOLO PARA EL HOME - POPULARES
  relevance?: number; //OK BUSQUEDA

  userData?: CollectionUserData;
  userSummary?: CollectionUserSummary;
}
