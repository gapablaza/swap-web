import { Item } from "./item.model";
import { Pagination } from "./pagination.model";

export interface TradesUserCollection {
    collectionData: {
        id: number,
        image: string,
        name: string,
        publisherId: number,
        publisherName: string,
    },
    searching?: Item[],
    totalSearching: number,
    trading?: Item[],
    totalTrading: number,
}

export interface TradesUser {
    collections: TradesUserCollection[],
    userData: {
        accountTypeId: number,
        accountTypeName: string,
        daysSinceLogin: number,
        displayName: string,
        id: number,
        image: string | null,
        location_city: string,
        location_country: string,
        negatives: number,
        positives: number,
        tradesWithUser: number,
    },
    order: number,
}

export interface Trades {
    allowedUsers: number,
    paginate: Pagination | boolean,
    totalTrades: number,
    totalUsers: number,
    uniqueTrades: number,
    user: TradesUser[],
}