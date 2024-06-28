export interface Item {
  created?: string | null,
  description: string,
  difficulty?: string,
  difficultyCategoryId?: number,
  id: number,
  image?: string | null,
  itemType: string | null,
  itemTypeId: number | null,
  name: string,
  position?: number,
  section?: string,
  quantity?: number,
  tradelist?: boolean,
  tradelistQuantity?: number,
  unique?: boolean,
  updated?: string,
  wishlist?: boolean,
  wishlistQuantity?: number,
}

export interface ItemType {
  id: number,
  name: string,
  sort: number,
}

