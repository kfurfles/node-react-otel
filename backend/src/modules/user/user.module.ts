import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserRepository } from './repository';
import { CreateUserUseCase } from './useCases/createUserUseCase';

@Module({
  providers: [
    CreateUserUseCase,
    PrismaService,
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
