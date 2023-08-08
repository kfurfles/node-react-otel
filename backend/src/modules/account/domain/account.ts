import { Either, right, left } from 'fp-ts/lib/Either';
import { Entity } from '@/Core/domain/Entity';
import { UniqueEntityID } from 'src/Core/domain/UniqueEntityID';
import { User } from '@/modules/user/domain/user';
import { AccountPassword } from './accountPassword';
import validator from 'validator';

export interface LocalCredential {
  password: AccountPassword;
}

export interface GoogleCredential {
  id: string;
}

export interface FacebookCredential {
  id: string;
}
export type ExternalCredential = GoogleCredential | FacebookCredential;

export interface AccountProps {
  user: User;
  confirmed: boolean;
  email: string;
  credentials: {
    local?: LocalCredential;
    facebook?: FacebookCredential;
    google?: GoogleCredential;
  };
}

export class Account extends Entity<AccountProps> {
  private constructor(props: AccountProps, publicId?: UniqueEntityID) {
    super(props, publicId);
  }

  public static create(
    props: AccountProps,
    publicId?: UniqueEntityID,
  ): Either<string, Account> {
    const {
      credentials: { facebook, google, local },
      email,
    } = props;

    if (!validator.isEmail(email)) {
      return left('the account email is invalid');
    }

    if (!!facebook && validator.isEmpty(facebook.id)) {
      return left("the facebook_id param can't be empty");
    }

    if (!!google && validator.isEmpty(google.id)) {
      return left("the google_id can't be empty");
    }

    if (!!local && !local.password.isAlreadyHashed()) {
      return left('the password should be hashed');
    }

    return right(new Account(props, publicId));
  }

  public hasFacebookId() {
    !!this.props.credentials.facebook;
  }
  public hasGoogleId() {
    !!this.props.credentials.google;
  }
  public hasLocalId() {
    !!this.props.credentials.local;
  }
}
