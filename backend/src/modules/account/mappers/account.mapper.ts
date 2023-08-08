import { Account } from '@prisma/client';
import { IAccount } from '../interface';

export function toDto(entity: Account): IAccount {
  const { confirmed, email, facebook_id, google_id, id, password, userId } =
    entity;

  return {
    confirmed,
    email,
    facebook_id,
    google_id,
    id,
    password,
    userId,
  };
}
