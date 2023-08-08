import { Module } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserUseCase } from '../useCases/createUserUseCase';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { UserRepository } from '../repository';

@Module({
  providers: [
    UserService,
    CreateUserUseCase,
    PrismaService,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
  ],
  exports: [UserService, CreateUserUseCase],
})
export class UserApiModule {}
