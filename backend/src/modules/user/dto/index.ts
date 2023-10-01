import { IUser, ICredentials } from '../interface';
export class CreateUserLocalDto implements Omit<IUser, 'id' | 'confirmed'> {
  email: string;
  credential: ICredentials;
}

export class CreatedUserDto implements IUser {
  confirmed: boolean;
  email: string;
  id: string;
}
