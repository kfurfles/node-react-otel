import { ks_users, ks_authentication_user_strategies } from '@prisma/client';
export type IUser = Pick<ks_users, 'id' | 'email' | 'confirmed'>;
export type IAuthStrategies = Pick<
  ks_authentication_user_strategies,
  'name' | 'external_id'
>;

export type IExternalCredential = {
  type: 'external';
} & IAuthStrategies;

export type ILocalCredential = {
  type: 'local';
  password: string;
};

export type ICredentials = IExternalCredential | ILocalCredential;
