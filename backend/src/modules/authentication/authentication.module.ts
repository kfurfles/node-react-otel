import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { GoogleStrategy } from './strategies/google/google.strategy';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { AccountApiModule } from '../account/api/accountApi.module';
import { AfterAccountCreated } from './subscribers/afterAccountCreated';
import { RegisterAccountUseCase } from './useCases/registerAccountUseCase';
import { createAccountToken } from '../authorizaation/useCase/tokenuseCase';

@Module({
  imports: [AccountApiModule],
  controllers: [AuthenticationController],
  providers: [
    GoogleStrategy,
    PrismaService,
    AfterAccountCreated,
    RegisterAccountUseCase,
    { provide: 'CREATE_ACCOUNT_TOKEN', useValue: createAccountToken },
  ],
})
export class AuthenticationModule {}
