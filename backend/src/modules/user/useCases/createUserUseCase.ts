import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repository';
import { User } from '../domain/user';
import { isLeft } from 'fp-ts/lib/Either';
import { ValueObjectException } from '@/Core/domain/ValueObjectException';
import { UseCase } from '@/Core/domain/UseCase';
import { CreateUserDto, CreatedUserDto } from '../dto';

@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserDto, CreatedUserDto>
{
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ lastname, name, picture }: CreateUserDto) {
    const user = User.create({ lastname, name, picture });

    if (isLeft(user)) {
      throw new ValueObjectException(user.left);
    }

    return this.userRepository.createUser({
      ...user.right.props,
      picture: picture ?? null,
    });
  }
}
