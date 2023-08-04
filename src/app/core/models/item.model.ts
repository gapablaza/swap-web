export interface Item {
  created?: string | null,
  description: string,
  difficulty?: string,
  difficultyCategoryId?: number,
  id: number,
  image?: string | null,
  name: string,
  position?: number,
  quantity?: number,
  tradelist?: boolean,
  tradelistQuantity?: number,
  unique?: boolean,
  updated?: string,
  wishlist?: boolean,
  wishlistQuantity?: number,
}

// export interface ChecklistItem {
//   description?: string,
//   itemType?: string,
//   itemTypeId?: number,
//   name: string,
//   position?: number,
//   section?: string,
// }

export interface ItemType {
  id: number,
  name: string,
  sort: number,
}

