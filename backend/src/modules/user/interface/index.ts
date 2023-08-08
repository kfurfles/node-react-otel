import { User } from '@prisma/client';

export type IUser = Pick<User, 'id' | 'lastname' | 'name' | 'picture'>;
