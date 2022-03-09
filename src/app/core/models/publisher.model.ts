export class Publisher {
  public id: number; //OK
  public name: string; //OK
  public description?: string | null; //OK
  public image?: string | null; //OK

  constructor() {
    this.id = 0;
    this.name = '';
  }
}
