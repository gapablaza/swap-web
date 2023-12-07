export interface Suggest {
    type: string,
    id: number,
    title: string,
    subtitle: string | null,
    image: string,
    relevance: number,
    url: string
  }