import { Item } from './item.model';

export interface TopsCategory {
    id: number,
    items: Item[],
    name: string,
    quantity: number
}

export interface Tops {
  available: boolean,
  categories: TopsCategory[]
}
