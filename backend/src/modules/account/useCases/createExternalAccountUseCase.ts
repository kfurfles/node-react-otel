import { UserService } from '@/modules/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../repository';
import { IFacebookCredential, IGoogleCredential } from '../interface';
import { UseCase } from '@/Core/domain/UseCase';
import { AccountDto } from '../dto';
import { isLeft } from 'fp-ts/lib/Either';
import { User } from '@/modules/user/domain/user';
import { ValueObjectException } from '@/Core/domain/ValueObjectException';
import { UseCaseException } from '@/Core/domain/UseCaseException';

export interface CreateExternalAccountParams {
  name: string;
  lastname: string;
  picture: string;
  credentials: IGoogleCredential | IFacebookCredential;
}

@Injectable()
export class CreateExternalAccountUseCase
  implements UseCase<CreateExternalAccountParams, AccountDto>
{
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UserService,
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: IAccountRepository,
  ) {}

  /**
   * Cria uma conta de usuário associada ao Facebook.
   *
   * @param user O objeto do tipo User contendo as informações do usuário.
   * @param facebook_id O ID do Facebook do usuário.
   * @param email O email do usuário fornecido pelo Facebook.
   * @throws UseCaseException se ocorrer um erro ao criar a conta.
   * @returns Uma Promise que resolve com o objeto de conta criada (Account) se a operação for bem-sucedida.
   */
  private async createFBAccount(
    user: User,
    { facebook_id, email }: IFacebookCredential,
  ) {
    try {
      const {
        props: { lastname, name, picture },
      } = user;
      const { id: userId } = await this.usersService.create({
        lastname,
        name,
        picture,
      });

      const createAccount = await this.accountRepository.createAccount({
        confirmed: false,
        userId,
        email,
        facebook_id,
      });

      return createAccount;
    } catch (error) {
      throw new UseCaseException(error.message);
    }
  }

  /**
   * Cria uma conta de usuário associada ao Google.
   *
   * @param user O objeto do tipo User contendo as informações do usuário.
   * @param google_id O ID do Google do usuário.
   * @param email O email do usuário fornecido pelo Google.
   * @throws UseCaseException se ocorrer um erro ao criar a conta.
   * @returns Uma Promise que resolve com o objeto de conta criada (Account) se a operação for bem-sucedida.
   */
  private async createGoogleAccount(
    user: User,
    { google_id, email }: IGoogleCredential,
  ) {
    try {
      const {
        props: { lastname, name, picture },
      } = user;
      const { id: userId } = await this.usersService.create({
        lastname,
        name,
        picture,
      });

      const createAccount = await this.accountRepository.createAccount({
        confirmed: false,
        userId,
        email,
        google_id,
      });

      return createAccount;
    } catch (error) {
      throw new UseCaseException(error.message);
    }
  }

  async execute({
    name,
    lastname,
    picture,
    credentials,
  }: CreateExternalAccountParams) {
    try {
      const account = await this.accountRepository.findByExternalId(
        credentials,
      );

      if (!!account) {
        return account;
      }
    } catch (error) {
      throw new UseCaseException(error.message);
    }

    const user = User.create({
      lastname,
      name,
      picture,
    });

    if (isLeft(user)) {
      throw new ValueObjectException(user.left);
    }

    switch (credentials.type) {
      case 'facebook':
        return this.createFBAccount(user.right, credentials);

      default:
        return this.createGoogleAccount(user.right, credentials);
    }
  }
}
