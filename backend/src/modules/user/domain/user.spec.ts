import { right, left, Right, isRight, Either, isLeft } from 'fp-ts/Either';
import { User, UserProps } from './user';
import { UserPassword } from './userPassword';

const createValidUser = (props: UserProps) => {
  return (User.create(props) as Right<User>).right;
};

const password = (
  UserPassword.create({
    value: '$2a$10$uMiIQognc2QmevrR66/xbuAhCRiy8f79nDnP39gibG0qney6ZRdZW@',
    hashed: true,
  }) as Right<UserPassword>
).right;

const passwordNoHashed = (
  UserPassword.create({
    value: 'Password123@apsodk0a9',
    hashed: false,
  }) as Right<UserPassword>
).right;

describe('User', () => {
  test('email não é um formato de e-mail válido', () => {
    const invalidUser: UserProps = {
      email: 'invalidemail', // Não é um formato de e-mail válido
      confirmed: true,
      strategies: [],
    };

    const result = User.create(invalidUser);

    expect(isLeft(result)).toBeTruthy();
    expect(result).toEqual(left('email should be valid'));
  });

  test('Nenhuma estratégia é fornecida', () => {
    const invalidUser: UserProps = {
      email: 'test@example.com',
      confirmed: true,
      strategies: [],
    };

    const result = User.create(invalidUser);

    expect(isLeft(result)).toBeTruthy();
    expect(result).toEqual(left("can't create user with empty strategy"));
  });

  test('Estratégia local está correta e a senha é hasheada', () => {
    const validUser: UserProps = {
      email: 'test@example.com',
      confirmed: true,
      strategies: [
        {
          id: 'local1',
          name: 'local',
          externalId: '',
        },
      ],
      localAuth: {
        password: password,
      },
    };

    const result = User.create(validUser);

    expect(isRight(result)).toBeTruthy();
  });

  test('getExternalIdByStrategy com estratégia válida', () => {
    const user = createValidUser({
      email: 'test@example.com',
      confirmed: true,
      strategies: [
        {
          id: 'google1',
          name: 'google',
          externalId: 'google123',
        },
      ],
    });

    const externalId = user.getExternalIdByStrategy('google');

    expect(externalId).toBe('google123');
  });

  test('getExternalIdByStrategy com estratégia inválida', () => {
    const user = createValidUser({
      email: 'test@example.com',
      confirmed: true,
      strategies: [
        {
          id: 'google1',
          name: 'google',
          externalId: 'google123',
        },
      ],
    });

    const externalId = user.getExternalIdByStrategy('facebook');

    expect(externalId).toBeNull();
  });

  test('Usuário com estratégias externas apenas', () => {
    const userWithExternalStrategies: UserProps = {
      email: 'test@example.com',
      confirmed: true,
      strategies: [
        {
          id: 'google1',
          name: 'google',
          externalId: 'google123',
        },
        {
          id: 'facebook1',
          name: 'facebook',
          externalId: 'facebook123',
        },
      ],
    };

    const result = User.create(userWithExternalStrategies);

    expect(isRight(result)).toBeTruthy();
    const user = (result as Right<User>).right;
    expect(user.hasLocalAuth()).toBeFalsy(); // Não deve ter autenticação local
  });

  test('Usuário com estratégia local e senha hasheada', () => {
    const userWithHashedPassword: UserProps = {
      email: 'test@example.com',
      confirmed: true,
      strategies: [
        {
          id: 'local1',
          name: 'local',
          externalId: 'asd',
        },
      ],
      localAuth: {
        password: password,
      },
    };

    const result = User.create(userWithHashedPassword);

    expect(isRight(result)).toBeTruthy();
    const user = (result as Right<User>).right;
    expect(user.hasLocalAuth()).toBeTruthy(); // Deve ter autenticação local
  });

  test('Usuário com estratégia local e senha não hasheada', () => {
    const userWithLocalStrategy: UserProps = {
      email: 'test@example.com',
      confirmed: true,
      strategies: [
        {
          id: 'local1',
          name: 'local',
          externalId: '',
        },
      ],
      localAuth: {
        password: passwordNoHashed,
      },
    };

    const result: Either<string, User> = User.create(userWithLocalStrategy);

    expect(isLeft(result)).toBeTruthy();
    expect(result).toEqual(left('the password should be hashed'));
  });
});
