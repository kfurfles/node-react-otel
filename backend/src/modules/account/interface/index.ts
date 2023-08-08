import { OptionalKeys } from '@/helpers/types';
import { Account } from '@prisma/client';

export type IGoogleCredential = {
  google_id: string;
  email: string;
  type: 'google';
};
export type IFacebookCredential = {
  facebook_id: string;
  email: string;
  type: 'facebook';
};
export type ILocalCredential = {
  email: string;
  type: 'local';
  password: string;
};
export type ICredentials =
  | IGoogleCredential
  | IFacebookCredential
  | ILocalCredential;

export type IAccount = OptionalKeys<
  Pick<
    Account,
    | 'confirmed'
    | 'email'
    | 'facebook_id'
    | 'google_id'
    | 'id'
    | 'password'
    | 'userId'
  >,
  'facebook_id' | 'google_id' | 'password'
>;
