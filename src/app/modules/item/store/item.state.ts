import { createFeature, createReducer, on } from "@ngrx/store";

import { Collection, Item, User } from "src/app/core";
import { itemActions } from "./item.actions";

interface State {
    item: Item | null;
    collection: Collection | null;
    trading: User[];
    wishing: User[];

    isLoaded: boolean;
    error: string | null;
}

const initialState: State = {
    item: null,
    collection: null,
    trading: [],
    wishing: [],

    isLoaded: false,
    error: null,
};

export const itemFeature = createFeature({
    name: 'item',
    reducer: createReducer(
        initialState,
        on(itemActions.cleanData, (state) => initialState),

        // load item data
        on(itemActions.loadData, (state) => ({
            ...state,
            isLoaded: false,
        })),
        on(itemActions.loadDataSuccess, (state, { item, collection, trading, wishing }) => ({
            ...state,
            item,
            collection,
            trading,
            wishing,
            isLoaded: true,
        })),
        on(itemActions.loadDataFailure, (state, { error }) => ({
            ...state,
            isLoaded: true,
            error,
        })),
    ), 

})