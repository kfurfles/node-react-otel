import { User, Authentication_User_Strategies } from '@prisma/client';
export type IUser = Pick<User, 'id' | 'email' | 'confirmed'>;
export type IAuthStrategies = Pick<
  Authentication_User_Strategies,
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
