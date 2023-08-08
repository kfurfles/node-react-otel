import { right, left, Right } from 'fp-ts/Either';
import { User, UserProps } from './user';

describe('User Domain', () => {
  it('should create a user with valid data', () => {
    const userProps = {
      name: 'John',
      lastname: 'Doe',
      picture: 'https://example.com/avatar.jpg',
    };

    const result = User.create(userProps);
    expect(result).toEqual(right(expect.any(User)));
  });

  it('should create a user with valid name and lastname', () => {
    const userProps = {
      name: 'John',
      lastname: 'Doe',
      picture: 'https://myphoto.png',
    };

    const user = User.create(userProps);

    expect(user).toEqual(right(expect.any(User)));
  });

  it('should fail to create a user with invalid url', () => {
    const invalidUserProps = {
      name: 'J0hn',
      lastname: 'Doe',
      picture: 'invalid-url',
    };

    const result = User.create(invalidUserProps);
    expect(result).toEqual(left('O campo picture deve ser uma URL válida.'));
  });

  it('should create a user with valid name and lastname with accents', () => {
    const userProps = {
      name: 'Joã',
      lastname: 'Pão',
      picture: 'https://myphoto.png',
    };

    const user = User.create(userProps);

    expect(user).toEqual(right(expect.any(User)));
    expect((user as Right<User>).right.props).toMatchObject({
      name: 'Joã',
      lastname: 'Pão',
      picture: 'https://myphoto.png',
    });
  });

  it('should not create a user with name less than 3 characters', () => {
    const userProps = {
      name: 'Jo',
      lastname: 'Doe',
      picture: 'https://myphoto.png',
    };

    const user = User.create(userProps);

    expect(user).toEqual(left('O nome deve ter pelo menos 3 caracteres'));
  });

  it('should not create a user with lastname less than 3 characters', () => {
    const userProps = {
      name: 'John',
      lastname: 'Do',
      picture: 'https://myphoto.png',
    };

    const user = User.create(userProps);

    expect(user).toEqual(left('O sobrenome deve ter pelo menos 3 caracteres'));
  });

  it('should not create a user with lastname consisting only of numbers', () => {
    const userProps = {
      name: 'John',
      lastname: '123',
      picture: 'https://myphoto.png',
    };

    const user = User.create(userProps);

    expect(user).toEqual(
      left('O sobrenome deve conter apenas letras e números'),
    );
  });

  it('should not create a user with lastname consisting only of numbers', () => {
    const userProps = {
      name: 'John',
      lastname: '123@',
      picture: 'https://myphoto.png',
    };

    const user = User.create(userProps);

    expect(user).toEqual(
      left('O sobrenome deve conter apenas letras e números'),
    );
  });
});
