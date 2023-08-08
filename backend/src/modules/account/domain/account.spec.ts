import { User } from '@/modules/user/domain/user';
import { Account, AccountProps } from './Account';
import { AccountPassword } from './accountPassword';
import { right, left, Right } from 'fp-ts/lib/Either';

const getValidLocalPassword = async () => {
  const hashedPassword = await (
    AccountPassword.create({
      value: 'StrongPassword123!@#',
      hashed: false,
    }) as Right<AccountPassword>
  ).right.getHashedValue();

  return (
    AccountPassword.create({
      value: hashedPassword,
      hashed: true,
    }) as Right<AccountPassword>
  ).right;
};

describe('Account', () => {
  const validUser = (
    User.create({
      name: 'John',
      lastname: 'Doe',
      picture: 'http://mypicture/123.png',
    }) as Right<User>
  ).right;

  describe('create', () => {
    it('should create an Account instance with valid local credential', async () => {
      const validProps: AccountProps = {
        user: validUser,
        confirmed: true,
        email: 'john@example.com',
        credentials: {
          local: {
            password: await getValidLocalPassword(),
          },
        },
      };

      const accountResult = Account.create(validProps);

      expect(accountResult).toEqual(right(expect.any(Account)));
    });

    it('should create an Account instance with valid facebook credential', () => {
      const validProps: AccountProps = {
        user: validUser,
        confirmed: true,
        email: 'john.doe@example.com',
        credentials: {
          facebook: {
            id: 'random',
          },
        },
      };

      const accountResult = Account.create(validProps);

      expect(accountResult).toEqual(right(expect.any(Account)));
    });

    it('should create an Account instance with valid google credential', () => {
      const validProps: AccountProps = {
        user: validUser,
        confirmed: true,
        email: 'john.doe@example.com',
        credentials: {
          google: {
            id: 'random',
          },
        },
      };

      const accountResult = Account.create(validProps);

      expect(accountResult).toEqual(right(expect.any(Account)));
    });

    it("should return an error when the 'email' param is invalid or empty", () => {
      const validProps: AccountProps = {
        user: validUser,
        confirmed: true,
        email: '',
        credentials: {
          google: {
            id: 'random',
          },
        },
      };

      const accountResult = Account.create(validProps);

      expect(accountResult).toEqual(left('the account email is invalid'));
    });

    it("should return an error when the 'facebook_id' param is empty for 'facebook' type", () => {
      const propsWithEmptyFacebookId: AccountProps = {
        user: validUser,
        confirmed: true,
        email: 'john.doe@example.com',
        credentials: {
          facebook: {
            id: '',
          },
        },
      };

      const accountResult = Account.create(propsWithEmptyFacebookId);

      expect(accountResult).toEqual(
        left("the facebook_id param can't be empty"),
      );
    });

    it("should return an error when the 'google_id' param is empty for 'google' type", () => {
      const propsWithEmptyGoogleId: AccountProps = {
        user: validUser,
        confirmed: true,
        email: 'john.doe@example.com',
        credentials: {
          google: {
            id: '',
          },
        },
      };

      const accountResult = Account.create(propsWithEmptyGoogleId);

      expect(accountResult).toEqual(left("the google_id can't be empty"));
    });

    it("should return an error when the password is not hashed for 'local' type", async () => {
      const invalidPassword = (
        AccountPassword.create({
          value: 'StrongPassword123!@#',
          hashed: false,
        }) as Right<AccountPassword>
      ).right;
      const propsWithInvalidPassword: AccountProps = {
        confirmed: false,
        email: 'john.doe@example.com',
        user: validUser,
        credentials: {
          local: {
            password: invalidPassword,
          },
        },
      };

      const accountResult = Account.create(propsWithInvalidPassword);

      expect(accountResult).toEqual(left('the password should be hashed'));
    });
  });
});
