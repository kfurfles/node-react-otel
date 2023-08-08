import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateAccountUseCase,
  CreateAccountParams,
} from './createAccountUseCase';
import { UserService } from '@/modules/user/user.service';
import { IAccountRepository } from '../repository';
import { Account } from '../domain/Account';
import { User } from '@/modules/user/domain/user';
import { ValueObjectException } from '@/Core/domain/ValueObjectException';
import { AccountPassword } from '../domain/accountPassword';
import { UseCaseException } from '@/Core/domain/UseCaseException';
import { Either, right, left, Right } from 'fp-ts/lib/Either';
import { AccountDto } from '../dto';
import {
  IFacebookCredential,
  IGoogleCredential,
  ILocalCredential,
} from '../interface';

describe('CreateAccountUseCase', () => {
  let useCase: CreateAccountUseCase;
  let createAccountUseCase: CreateAccountUseCase;
  let userService: UserService;
  let accountRepository: IAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountUseCase,
        {
          provide: 'USER_SERVICE',
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'ACCOUNT_REPOSITORY',
          useValue: {
            createAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateAccountUseCase>(CreateAccountUseCase);
    userService = module.get<UserService>('USER_SERVICE');
    accountRepository = module.get<IAccountRepository>('ACCOUNT_REPOSITORY');
  });

  beforeEach(() => {
    // Initializing the CreateAccountUseCase with mocked dependencies
    createAccountUseCase = new CreateAccountUseCase(
      userService,
      accountRepository,
    );
  });

  describe('createLocalAccount', () => {
    it('should create a local account successfully', async () => {
      // Arrange
      const user: User = (
        User.create({
          name: 'John',
          lastname: 'Doe',
          picture: 'https://example.com/picture.jpg',
        }) as Right<User>
      ).right;

      const credentialData: ILocalCredential = {
        email: 'john.doe@example.com',
        password: 'password123@#',
        type: 'local',
      };

      jest.spyOn(userService, 'create').mockResolvedValue({
        id: '1234',
        lastname: 'doe',
        name: 'jhon',
        picture: 'https://picture/123.png',
      });

      jest.spyOn(accountRepository, 'createAccount').mockResolvedValue({
        id: '98172',
        confirmed: false,
        email: 'john.doe@example.com',
        userId: '1234',
        password: '123456@12345',
      });

      // Act
      const createdAccount = await createAccountUseCase['createLocalAccount'](
        user,
        credentialData,
      );

      // Assert
      expect(createdAccount).toBeDefined();
      expect(createdAccount.confirmed).toBe(false);
      expect(createdAccount.email).toBe('john.doe@example.com');
      expect(createdAccount.password).toBeTruthy();
    });

    it('should throw a ValueObjectException when creating a local account with an invalid password', async () => {
      // Arrange
      const user: User = (
        User.create({
          name: 'John',
          lastname: 'Doe',
          picture: 'https://example.com/picture.jpg',
        }) as Right<User>
      ).right;

      const credentialData: ILocalCredential = {
        email: 'john.doe@example.com',
        password: '', // Invalid password
        type: 'local',
      };

      jest.spyOn(userService, 'create').mockResolvedValue({
        id: '1234',
        lastname: 'Doe',
        name: 'John',
        picture: 'https://example.com/picture.jpg',
      });

      // Act & Assert
      await expect(
        createAccountUseCase['createLocalAccount'](user, credentialData),
      ).rejects.toThrow(ValueObjectException);
    });

    // Add more test cases for createLocalAccount as needed
  });

  describe('createFBAccount', () => {
    it('should create a Facebook account successfully', async () => {
      // Arrange
      const user: User = (
        User.create({
          name: 'John',
          lastname: 'Doe',
          picture: 'https://example.com/picture.jpg',
        }) as Right<User>
      ).right;

      const credentialData: IFacebookCredential = {
        facebook_id: 'facebook123',
        email: 'john.doe@example.com',
        type: 'facebook',
      };

      jest.spyOn(userService, 'create').mockResolvedValue({
        id: '1234',
        lastname: 'Doe',
        name: 'John',
        picture: 'https://example.com/picture.jpg',
      });

      jest.spyOn(accountRepository, 'createAccount').mockResolvedValue({
        id: '98172',
        confirmed: false,
        email: 'john.doe@example.com',
        userId: '1234',
        facebook_id: 'facebook123',
      });

      // Act
      const createdAccount = await createAccountUseCase['createFBAccount'](
        user,
        credentialData,
      );

      // Assert
      expect(createdAccount).toBeDefined();
      expect(createdAccount.facebook_id).toBe('facebook123');
      expect(createdAccount.email).toBe('john.doe@example.com');
    });

    // Add more test cases for createFBAccount as needed
  });

  describe('createGoogleAccount', () => {
    it('should create a Google account successfully', async () => {
      // Arrange
      const user: User = (
        User.create({
          name: 'John',
          lastname: 'Doe',
          picture: 'https://example.com/picture.jpg',
        }) as Right<User>
      ).right;

      const credentialData: IGoogleCredential = {
        google_id: 'google123',
        email: 'john.doe@example.com',
        type: 'google',
      };

      jest.spyOn(userService, 'create').mockResolvedValue({
        id: '1234',
        lastname: 'Doe',
        name: 'John',
        picture: 'https://example.com/picture.jpg',
      });

      jest.spyOn(accountRepository, 'createAccount').mockResolvedValue({
        id: '98172',
        confirmed: false,
        email: 'john.doe@example.com',
        userId: '1234',
        google_id: 'google123',
      });

      // Act
      const createdAccount = await createAccountUseCase['createGoogleAccount'](
        user,
        credentialData,
      );

      // Assert
      expect(createdAccount).toBeDefined();
      expect(createdAccount.google_id).toBe('google123');
      expect(createdAccount.email).toBe('john.doe@example.com');
    });

    // Add more test cases for createGoogleAccount as needed
  });
});
