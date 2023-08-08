import { UseCase } from '@/Core/domain/UseCase';
import { AccountService } from '@/modules/account/account.service';
import { CreateAccountDto } from '@/modules/account/dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoogleStrategy } from '../strategies/google/google.strategy';
import { IAccount } from '@/modules/account/interface';

type Params = CreateAccountDto | string;

@Injectable()
export class RegisterAccountUseCase implements UseCase<Params, any> {
  constructor(
    private readonly accountService: AccountService,
    private readonly googleStrategy: GoogleStrategy,
    @Inject('CREATE_ACCOUNT_TOKEN')
    private readonly createToken: (user: IAccount) => string,
  ) {}

  isLocalParams(params: Params): params is CreateAccountDto {
    return (params as CreateAccountDto)?.credentials?.type === 'local';
  }

  private async local(payload: CreateAccountDto) {
    const {
      credentials: { password, email },
      lastname,
      name,
    } = payload;

    const account = await this.accountService.findByEmail({ email });
    if (!!account) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    try {
      await this.accountService.createWithEmail({
        credentials: {
          email,
          password,
          type: 'local',
        },
        lastname,
        name,
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possivel criar essa conta',
      );
    }
  }

  private async getGoogleUser(accessToken: string) {
    try {
      const user = await this.googleStrategy.validate(accessToken);

      if (user === 'GENERIC_ERROR') {
        return {
          type: 'ERROR_GENERIC',
        } as const;
      }

      if (user === 'INVALID_TOKEN_SIGNATURE') {
        return { type: 'ERROR_INVALID_TOKEN_SIGNATURE' } as const;
      }

      return {
        type: 'SUCCESS',
        payload: user,
      } as const;
    } catch (error) {
      return {
        type: 'ERROR_GENERIC',
      } as const;
    }
  }

  private async external(accessToken: string) {
    const user = await this.getGoogleUser(accessToken);

    if (user.type === 'ERROR_GENERIC') {
      throw new InternalServerErrorException(
        'Não foi possivel realizar o login',
      );
    }

    if (user.type === 'ERROR_INVALID_TOKEN_SIGNATURE') {
      throw new BadRequestException(
        'Não possivel validar as inforções recebidas do provedor de autenticação',
      );
    }

    const {
      payload: { email, id, lastname, name, picture },
    } = user;

    try {
      const createdExternal = await this.accountService.createWithExternal({
        credentials: {
          email,
          google_id: id,
          type: 'google',
        },
        lastname,
        name,
        picture,
      });

      const token = this.createToken(createdExternal);

      return { token };
    } catch (error) {
      return { type: 'ERROR_GENERIC' };
    }
  }

  execute(params: Params) {
    if (this.isLocalParams(params)) {
      return this.local(params);
    } else {
      return this.external(params);
    }
  }
}
