import { UserService } from '@/modules/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../repository';
import {
  ICredentials,
  ILocalCredential,
  IFacebookCredential,
  IGoogleCredential,
} from '../interface';
import { UseCase } from '@/Core/domain/UseCase';
import { AccountDto } from '../dto';
import { isLeft } from 'fp-ts/lib/Either';
import { Account } from '../domain/Account';
import { User } from '@/modules/user/domain/user';
import { ValueObjectException } from '@/Core/domain/ValueObjectException';
import { AccountPassword } from '../domain/accountPassword';
import { UseCaseException } from '@/Core/domain/UseCaseException';

export interface CreateAccountParams {
  name: string;
  lastname: string;
  credentials: ILocalCredential;
}

@Injectable()
export class CreateAccountUseCase
  implements UseCase<CreateAccountParams, AccountDto>
{
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UserService,
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: IAccountRepository,
  ) {}

  /**
   * Cria uma conta local para o usuário com as credenciais fornecidas.
   *
   * @param user O objeto do tipo User contendo as informações do usuário.
   * @param credentialData As credenciais do tipo ILocalCredential contendo o email e a senha do usuário.
   * @throws ValueObjectException se ocorrer um erro ao criar a senha ou se a conta não puder ser criada.
   * @returns Uma Promise que resolve com o objeto de conta criada (Account) se a operação for bem-sucedida.
   */
  private async createLocalAccount(
    user: User,
    credentialData: ILocalCredential,
  ) {
    const { email, password } = credentialData;

    const createdPassword = AccountPassword.create({
      value: password,
      hashed: false,
    });

    if (isLeft(createdPassword)) {
      throw new ValueObjectException(createdPassword.left);
    }

    try {
      await createdPassword.right.hashValue();
    } catch (error) {
      throw new ValueObjectException(error.message);
    }

    const account = Account.create({
      confirmed: false,
      user: user,
      email,
      credentials: {
        local: {
          password: createdPassword.right,
        },
      },
    });

    if (isLeft(account)) {
      throw new ValueObjectException(account.left);
    }

    const {
      props: { lastname, name },
    } = user;
    const { id: userId } = await this.usersService.create({
      lastname,
      name,
      picture: null,
    });

    try {
      const createAccount = await this.accountRepository.createAccount({
        confirmed: false,
        email: account.right.props.email,
        userId,
        password:
          await account.right.props.credentials.local.password.getHashedValue(),
      });

      return createAccount;
    } catch (error) {
      throw new UseCaseException(error.message);
    }
  }

  async execute({ name, lastname, credentials }: CreateAccountParams) {
    try {
      const account = await this.accountRepository.findByEmail({
        email: credentials.email,
      });
      if (!!account) {
        throw new Error('USER_ALREADY_EXIST');
      }
    } catch (error) {
      if (error.message === 'USER_ALREADY_EXIST') {
        throw new UseCaseException('Já existe um usuário com este email');
      }
      throw new UseCaseException(error.message);
    }

    const user = User.create({
      lastname,
      name,
    });

    if (isLeft(user)) {
      throw new ValueObjectException(user.left);
    }

    return this.createLocalAccount(user.right, credentials);
  }
}
