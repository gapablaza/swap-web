export class User {
  public accountTypeId: number; //OK
  public accountTypeName: string; //OK
  public active: boolean;
  public address_components?: string; //OK - SETTINGS
  public bio: string | null; //OK
  public collections?: number; //OK - BUSQUEDA
  public completed?: number; //OK - BUSQUEDA
  public completedCollections?: number; //OK - PERFIL USUARIO
  public contributions?: number; //OK - HOME MEDIA
  public daysSinceLogin: number; //OK
  public daysSinceRegistration: number; //OK
  public disabled: boolean; //OK
  public displayName: string; //OK
  public email?: string; //OK - SETTINGS
  public epochLastLogin: number; //OK
  public epochRegistration: number; //OK
  public facebook: string | null; //OK
  public google: string | null; //OK
  public id: number; //OK
  public image: string | null; //OK
  public isMod: boolean; //OK
  public lastLogin: string; //OK - CON TZ
  public location: string | null; //OK
  public location_city: string | null; //OK
  public location_country: string | null; //OK
  public negatives?: number; //OK - BUSQUEDA
  public notifyUnreadMessages: boolean; //OK
  public positives?: number; //OK - BUSQUEDA
  public relevance?: number; //OK - BUSQUEDA
  public registration: string; //OK - CON TZ
  public summary?: //OK - COLLECCIONISTAS DE UN ALBUM
  {
      collectionWishing: number,
      collectionTrading: number,
      completed: boolean,
      daysSinceUpdate: number,
  };
  public trading?: number; //OK - BUSQUEDA
  public totalItems?: number; //OK - HOME ITEMS
  public wishing?: number; //OK - BUSQUEDA

  constructor() {
    this.accountTypeId = 1;
    this.accountTypeName = 'Normal';
    this.active = true;
    this.bio = '';
    this.daysSinceLogin = 0;
    this.daysSinceRegistration = 0;
    this.disabled = false;
    this.displayName = '';
    this.epochLastLogin = 1640995200;
    this.epochRegistration = 1640995200;
    this.facebook = null;
    this.google = null;
    this.id = 0;
    this.image = null;
    this.isMod = false;
    this.lastLogin = '2022-01-01T00:00:00-00:00';
    this.location = null;
    this.location_city = null;
    this.location_country = null;
    this.notifyUnreadMessages = true;
    this.registration = '2022-01-01T00:00:00-00:00';
  }
}
