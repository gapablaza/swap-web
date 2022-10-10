import { Item } from './item.model';

export interface TradesWithUserCollection {
    id: number,
    image: string,
    name: string,
    possibleTrades: number,
    publisherId: number,
    publisherName: string,
    searching: Item[],
    totalSearching: number,
    trading: Item[],
    totalTrading: number
}

export interface TradesWithUser {
  collections: TradesWithUserCollection[];
  total: number;
  showTrades: boolean;
}
