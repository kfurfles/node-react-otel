import { right, left, Right } from 'fp-ts/lib/Either';
import { UserPassword } from './userPassword';

describe.only('UserPassword', () => {
  describe('create', () => {
    it('should create an userPassword instance with a valid password', () => {
      const validPassword = 'StrongPassword123!@#';
      const userPassword = UserPassword.create({ value: validPassword });

      expect(userPassword).toEqual(right(expect.any(UserPassword)));
    });

    it('should create an userPassword and hash itself after call hash method', async () => {
      const validPassword = 'StrongPassword123!@#';
      const userPassword = UserPassword.create({
        value: validPassword,
      }) as Right<UserPassword>;

      await userPassword.right.hashValue();

      expect(userPassword.right.value).not.toMatch(validPassword);
      // expect(userPassword).toEqual(right(expect.any(userPassword)));
    });

    it('should return an error message for an invalid password', () => {
      const invalidPassword = 'weak';
      const userPassword = UserPassword.create({
        value: invalidPassword,
        hashed: false,
      });

      expect(userPassword).toEqual(left(expect.any(String)));
    });
  });

  describe('comparePassword', () => {
    it('should return true when comparing a hashed password with the same plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const hashedPassword = await (
        UserPassword.create({
          value: validPassword,
          hashed: false,
        }) as Right<UserPassword>
      ).right.getHashedValue();

      const userPassword = UserPassword.create({
        value: hashedPassword,
        hashed: true,
      }) as Right<UserPassword>;

      const isMatch = await userPassword.right.comparePassword(validPassword);

      expect(isMatch).toBe(true);
      expect(userPassword.right.value).toBe(hashedPassword);
    });

    it('should return false when comparing a hashed password with a different plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const diffPassword = 'DifferentPassword456!@#';
      const hashedPassword = await (
        UserPassword.create({
          value: validPassword,
          hashed: true,
        }) as Right<UserPassword>
      ).right.getHashedValue();

      const userPassword = UserPassword.create({
        value: diffPassword,
        hashed: true,
      }) as Right<UserPassword>;

      const isMatch = await userPassword.right.comparePassword(hashedPassword);
      expect(isMatch).toBe(false);
    });

    it('should return true when comparing an unhashed password with the same plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const unhashedPassword = UserPassword.create({
        value: validPassword,
        hashed: false,
      }) as Right<UserPassword>;

      const isMatch = await unhashedPassword.right.comparePassword(
        validPassword,
      );
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing an unhashed password with a different plain-text password', async () => {
      const validPassword = 'StrongPassword123!@#';
      const diffPassword = 'DifferentPassword456!@#';
      const unhashedPassword = UserPassword.create({
        value: validPassword,
        hashed: true,
      }) as Right<UserPassword>;

      const isMatch = await unhashedPassword.right.comparePassword(
        diffPassword,
      );
      expect(isMatch).toBe(false);
    });
  });
});
