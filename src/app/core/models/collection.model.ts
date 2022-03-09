import { Publisher } from './publisher.model';

export class Collection {
  public collecting?: boolean; //OK COLECCION
  public completed?: boolean; //OK COLLECION DEL USUARIO
  public created: string; //OK - CON TZ
  public description: string | null; //OK
  public id: number; //OK
  public image: string; //OK
  public items: number; //OK
  public name: string; //OK
  public publisher: {
    data: Publisher
  };
  public recentCollecting?: number; //SOLO PARA EL HOME - POPULARES
  public release: string; //OK - SIN TZ
  public relevance?: number; //OK BUSQUEDA
  public summary?: { // OK - PERFIL USUARIO
    wishing: number,
    trading: number,
    completed: boolean,
    progress: number,
    created: string,
    updated: string,
  };
  public totalCollecting?: number; //OK
  public totalMedia?: number; //OK COLECCION
  public trading?: number; //OK COLLECION DEL USUARIO
  public updated?: string; //OK - CON TZ
  public wishing?: number; //OK COLLECION DEL USUARIO
  public year: number; //OK

  constructor() {
    this.created = '2022-01-01T00:00:00-00:00';
    this.description = null;
    this.id = 0;
    this.image = '';
    this.items = 0;
    this.name = '';
    this.publisher = { data: {} as Publisher };
    this.release = '2022-01-01 00:00:00';
    this.year = 2022;
  }
}
