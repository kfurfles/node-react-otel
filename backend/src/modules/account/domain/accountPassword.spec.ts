import { right, left, Right } from 'fp-ts/lib/Either';
import { AccountPassword } from './AccountPassword';

describe('AccountPassword', () => {
  describe('create', () => {
    it('should create an AccountPassword instance with a valid password', () => {
      const validPassword = 'StrongPassword123!@#';
      const accountPassword = AccountPassword.create({ value: validPassword });

      expect(accountPassword).toEqual(right(expect.any(AccountPassword)));
    });

    it('should create an AccountPassword and hash itself after call hash method', async () => {
      const validPassword = 'StrongPassword123!@#';
      const accountPassword = AccountPassword.create({
        value: validPassword,
      }) as Right<AccountPassword>;

      await accountPassword.right.hashValue();

      expect(accountPassword.right.value).not.toMatch(validPassword);
      // expect(accountPassword).toEqual(right(expect.any(AccountPassword)));
    });

    it('should return an error message for an invalid password', () => {
      const invalidPassword = 'weak';
      const accountPassword = AccountPassword.create({
        value: invalidPassword,
        hashed: false,
      });

      expect(accountPassword).toEqual(left(expect.any(String)));
    });
  });

  describe('comparePassword', () => {
    it('should return true when comparing a hashed password with the same plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const hashedPassword = await (
        AccountPassword.create({
          value: validPassword,
          hashed: false,
        }) as Right<AccountPassword>
      ).right.getHashedValue();

      const accountPassword = AccountPassword.create({
        value: hashedPassword,
        hashed: true,
      }) as Right<AccountPassword>;

      const isMatch = await accountPassword.right.comparePassword(
        validPassword,
      );

      expect(isMatch).toBe(true);
      expect(accountPassword.right.value).toBe(hashedPassword);
    });

    it('should return false when comparing a hashed password with a different plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const diffPassword = 'DifferentPassword456!@#';
      const hashedPassword = await (
        AccountPassword.create({
          value: validPassword,
          hashed: true,
        }) as Right<AccountPassword>
      ).right.getHashedValue();

      const accountPassword = AccountPassword.create({
        value: diffPassword,
        hashed: true,
      }) as Right<AccountPassword>;

      const isMatch = await accountPassword.right.comparePassword(
        hashedPassword,
      );
      expect(isMatch).toBe(false);
    });

    it('should return true when comparing an unhashed password with the same plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const unhashedPassword = AccountPassword.create({
        value: validPassword,
        hashed: false,
      }) as Right<AccountPassword>;

      const isMatch = await unhashedPassword.right.comparePassword(
        validPassword,
      );
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing an unhashed password with a different plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const diffPassword = 'DifferentPassword456!@#';
      const unhashedPassword = AccountPassword.create({
        value: validPassword,
        hashed: true,
      }) as Right<AccountPassword>;

      const isMatch = await unhashedPassword.right.comparePassword(
        diffPassword,
      );
      expect(isMatch).toBe(false);
    });
  });
});
