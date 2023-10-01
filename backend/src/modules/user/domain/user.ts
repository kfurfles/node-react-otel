import { Either, right, left, isRight } from 'fp-ts/lib/Either';
import { Entity } from '@/Core/domain/Entity';
import { UniqueEntityID } from '@/Core/domain/UniqueEntityID';
import { UserPassword } from './userPassword';
import * as Yup from 'yup';

export interface AuthUserStrategies {
  id?: string;
  name: string;
  externalId: string;
}

export interface AuthenticationLocal {
  id?: string;
  password: UserPassword;
}

type CredentialStrategy = {
  strategies: AuthUserStrategies[];
  localAuth?: AuthenticationLocal;
};

export type UserProps = {
  email: string;
  confirmed: boolean;
} & CredentialStrategy;

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, publicId?: UniqueEntityID) {
    super(props, publicId);
  }

  public static create(
    props: UserProps,
    publicId?: UniqueEntityID,
  ): Either<string, User> {
    try {
      const { confirmed, email, strategies = [], localAuth } = props;

      if (!Yup.boolean().isValidSync(confirmed))
        return left('confirmed status is required');

      if (!Yup.string().email().isValidSync(email))
        return left('email should be valid');

      if (strategies.length === 0)
        return left("can't create user with empty strategy");

      if (localAuth) {
        if (!props.localAuth.password.isAlreadyHashed())
          return left('the password should be hashed');
      }

      return right(new User(props, publicId));
    } catch (error) {
      return left(error.message);
    }
  }

  private getPassword() {
    if ('localAuth' in this.props) {
      const isAlreadyHashed = this.props?.localAuth.password.isAlreadyHashed();
      if (!isAlreadyHashed) return left('the password should be hashed');
      return right(this.props.localAuth);
    }

    return left('password not found');
  }

  public getExternalIdByStrategy(strategy: string) {
    if (this.props.strategies.length < 1) return null;

    const found = this.props.strategies.find(
      (s) => s.name.toLowerCase() === strategy.toLowerCase(),
    );

    if (found) return found.externalId;

    return null;
  }

  public hasLocalAuth() {
    const local = this.getPassword();
    return isRight(local);
  }
}
