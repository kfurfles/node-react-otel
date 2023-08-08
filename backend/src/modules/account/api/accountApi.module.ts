import { Module } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { AccountRepository } from '../repository';
import { AccountService } from '../account.service';
import { CreateAccountUseCase } from '../useCases/createAccountUseCase';
import { UserApiModule } from '@/modules/user/api/userApi.module';
import { UserService } from '@/modules/user/user.service';
import { CreateExternalAccountUseCase } from '../useCases/createExternalAccountUseCase';

@Module({
  imports: [UserApiModule],
  providers: [
    AccountService,
    CreateAccountUseCase,
    CreateExternalAccountUseCase,
    PrismaService,
    {
      provide: 'ACCOUNT_REPOSITORY',
      useClass: AccountRepository,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
  ],
  exports: [AccountService],
})
export class AccountApiModule {}
