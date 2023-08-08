import { Either, right, left } from 'fp-ts/lib/Either';
import * as Yup from 'yup';
import { Entity } from '@/Core/domain/Entity';
import { UniqueEntityID } from '@/Core/domain/UniqueEntityID';

export interface UserProps {
  name: string;
  lastname: string;
  picture?: string;
}

const regexPattern =
  '^(?![0-9]+$)(?![!@#$%^&*(),.?":{}|<>]+$)[\\p{L}\\d\\s]{3,}$';
const regex = new RegExp(regexPattern, 'u');

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, publicId?: UniqueEntityID) {
    super(props, publicId);
  }

  public static create(
    props: UserProps,
    publicId?: UniqueEntityID,
  ): Either<string, User> {
    const userSchema = Yup.object().shape({
      name: Yup.string()
        .min(3, 'O nome deve ter pelo menos 3 caracteres')
        .matches(regex, 'O nome deve conter apenas letras e números'),
      lastname: Yup.string()
        .min(3, 'O sobrenome deve ter pelo menos 3 caracteres')
        .matches(regex, 'O sobrenome deve conter apenas letras e números'),
      picture: Yup.string()
        .url('O campo picture deve ser uma URL válida.')
        .optional(),
    });

    try {
      userSchema.validateSync(props);
      return right(new User(props, publicId));
    } catch (error) {
      return left(error.message);
    }
  }
}
