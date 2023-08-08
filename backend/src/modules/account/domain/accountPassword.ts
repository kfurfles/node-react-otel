import { Either, right, left } from 'fp-ts/lib/Either';
import * as Yup from 'yup';
import * as bcrypt from 'bcrypt-nodejs';
import { ValueObject } from '@/Core/domain/valueObject';
import { ValueObjectException } from '@/Core/domain/ValueObjectException';

interface AccountPasswordProps {
  value: string;
  hashed?: boolean;
}

export class AccountPassword extends ValueObject<AccountPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: AccountPasswordProps) {
    super(props);
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  }

  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      } else {
        return resolve(this.hashPassword(this.props.value));
      }
    });
  }

  public async hashValue() {
    try {
      const hashedValue = await this.getHashedValue();
      const hashedPassword = new AccountPassword({
        value: hashedValue,
        hashed: true,
      });
      Object.assign(this, hashedPassword);
      return this.props.value;
    } catch (err) {
      throw new ValueObjectException(err.message);
    }
  }

  public static create({
    value,
    hashed,
  }: AccountPasswordProps): Either<string, AccountPassword> {
    const passwordSchema = Yup.string().matches(
      /^(?=.*[!@#$%^&*()_+{}|:;"'<>,.?/\\[\]-])(?=.*\d).{6,}$/,
      'A senha deve ter no mínimo 6 caracteres, conter pelo menos um caractere especial e pelo menos um número.',
    );

    try {
      passwordSchema.validateSync(value);
      return right(new AccountPassword({ value, hashed }));
    } catch (error) {
      return left(error.message);
    }
  }
}
