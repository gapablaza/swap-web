import { User } from './user.model';

export interface Image {
  base64: string | null;
  created: number;
  description: string | null;
  id: number;
  filename: string | null;
  functionalityId: number;
  updated: number;
  user?: User;
}
