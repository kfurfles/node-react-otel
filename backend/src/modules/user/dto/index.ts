import { IUser } from '../interface';

export class CreateUserDto implements Omit<IUser, 'id'> {
  name: string;
  lastname: string;
  picture: string;
}

export class CreatedUserDto implements IUser {
  id: string;
  name: string;
  lastname: string;
  picture: string;
}
