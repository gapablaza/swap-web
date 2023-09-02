import { User } from './user.model';

export interface History {
    id: number,
    rememberedId: number,
    rememberedStatusId: number | null,
    rememberedStatusName: string | null,
    rememberedValue: string | null,
    created: number,
    user: {
        data: User | [],
    };
}
