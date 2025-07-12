export interface UserCollection {
  //OK - COLLECCIONISTAS DE UN ALBUM
  collectionWishing: number;
  collectionTrading: number;
  completed: boolean;
  publicComment: string;
  daysSinceUpdate: number;
}

export interface UserSummary {
  //OK - BUSQUEDA
  collections?: number;
  completed?: number;
  negatives?: number;
  positives?: number;
  relevance?: number;
  trading?: number;
  wishing?: number;
  contributions?: number;
}

export interface User {
  accountTypeId: number; //OK
  accountTypeName: string; //OK
  active: boolean;
  bio: string | null; //OK
  daysSinceLogin: number; //OK
  daysSinceRegistration: number; //OK
  disabled: boolean; //OK
  displayName: string; //OK
  epochLastLogin: number; //OK
  epochRegistration: number; //OK
  facebook: string | null; //OK
  google: string | null; //OK
  id: number; //OK
  image: string | null; //OK
  isMod: boolean; //OK
  lastLogin: string; //OK - CON TZ
  location: string | null; //OK
  location_city: string | null; //OK
  location_country: string | null; //OK
  notifyUnreadMessages: boolean; //OK
  registration: string; //OK - CON TZ
  trustScore: number | null; //OK

  address_components?: string; //OK - SETTINGS
  email?: string; //OK - SETTINGS

  // completedCollections?: number; //OK - PERFIL USUARIO

  contributions?: number; //OK - HOME MEDIA
  totalItems?: number; //OK - HOME ITEMS

  voteStatus?: number;
  inBlacklist?: boolean; // PERFIL USUARIO

  collectionData?: UserCollection;
  userSummary?: UserSummary;
}
