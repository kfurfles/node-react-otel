import { IAccount, ILocalCredential, IGoogleCredential } from '../interface';

export class CreateAccountDto {
  name: string;
  lastname: string;
  credentials: ILocalCredential;
}

export class CreateExternalAccountDto {
  name: string;
  lastname: string;
  picture: string;
  credentials: IGoogleCredential;
  // credentials: IFacebookCredential | IGoogleCredential;
}

export class AccountDto implements IAccount {
  id: string;
  email: string;
  confirmed: boolean;
  userId: string;
  password?: string;
  google_id?: string;
  facebook_id?: string;
}
