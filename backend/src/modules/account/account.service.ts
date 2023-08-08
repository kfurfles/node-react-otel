import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountUseCase } from './useCases/createAccountUseCase';
import { CreateAccountDto, CreateExternalAccountDto } from './dto';
import { IAccountRepository } from './repository';
import { CreateExternalAccountUseCase } from './useCases/createExternalAccountUseCase';

@Injectable()
export class AccountService {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly createExternalAccountUseCase: CreateExternalAccountUseCase,
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: IAccountRepository,
  ) {}

  async createWithEmail(params: CreateAccountDto) {
    return this.createAccountUseCase.execute(params);
  }
  async createWithExternal(params: CreateExternalAccountDto) {
    return this.createExternalAccountUseCase.execute(params);
  }

  async findByEmail(params: { email: string }) {
    return this.accountRepository.findByEmail(params);
  }
}
