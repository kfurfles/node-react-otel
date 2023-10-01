import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repository';
import { User } from '../domain/user';
import { isLeft } from 'fp-ts/lib/Either';
import { ValueObjectException } from '@/Core/domain/ValueObjectException';
import { UseCase } from '@/Core/domain/UseCase';
import { CreateUserLocalDto, CreatedUserDto } from '../dto';
import { UserPassword } from '../domain/userPassword';

@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserLocalDto, CreatedUserDto>
{
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
  ) {}

  private async createLocalUser(email: string, pwd: string) {
    const password = UserPassword.create({ value: pwd, hashed: false });

    if (isLeft(password)) {
      throw new ValueObjectException(password.left);
    }
    await password.right.hashValue();

    const user = User.create({
      confirmed: false,
      email,
      localAuth: {
        password: password.right,
      },
      strategies: [],
    });

    return user;
  }

  private createExternalUser(
    email: string,
    providerName: string,
    providerUserId: string,
  ) {
    const user = User.create({
      confirmed: false,
      email,
      strategies: [
        {
          externalId: providerUserId,
          name: providerName,
        },
      ],
    });

    return user;
  }

  async execute({ email, credential }: CreateUserLocalDto) {
    const user =
      credential.type === 'local'
        ? await this.createLocalUser(email, credential.password)
        : this.createExternalUser(
            email,
            credential.name,
            credential.external_id,
          );

    if (isLeft(user)) {
      throw new ValueObjectException(user.left);
    }
    return this.userRepository.createUser({
      ...user.right.props,
    });
  }
}
