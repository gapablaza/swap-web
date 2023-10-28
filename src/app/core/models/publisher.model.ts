export interface Publisher {
  id: number, //OK
  name: string, //OK
  description?: string | null, //OK
  bio: string | null,
  image?: string | null, //OK

  collections?: number, // Publishers feature
}
