import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserRepository } from './repository';
import { CreateUserUseCase } from './useCases/createUserUseCase';

@Module({
  controllers: [UsersController],
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
