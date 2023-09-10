import { User } from './user.model';

export interface Image {
  base64: string | null;
  created: number;
  description: string | null;
  id: number;
  functionalityId: number;
  updated: number;
  url: string | null;
  user?: User;
}
