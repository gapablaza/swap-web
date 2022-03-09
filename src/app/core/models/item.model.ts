export class Item {
  public created?: string | null;
  public description: string;
  public difficulty?: string;
  public difficultyCategoryId?: number;
  public id: number;
  public image?: string | null;
  public name: string;
  public position?: number;
  public quantity?: number;
  public tradelist?: boolean;
  public tradelistQuantity?: number;
  public updated?: string;
  public wishlist?: boolean;
  public wishlistQuantity?: number;

  constructor() {
    this.description = '';
    this.id = 0;
    this.name = '';
  }
}
