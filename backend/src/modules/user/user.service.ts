import { Injectable, Optional } from '@nestjs/common';
import { CreateUserLocalDto } from './dto';
import { CreateUserUseCase } from './useCases/createUserUseCase';

@Injectable()
export class UserService {
  constructor(
    @Optional() private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  create(createUserDto: CreateUserLocalDto) {
    const { email, credential } = createUserDto;
    return this.createUserUseCase.execute({
      email,
      credential,
    });
  }
}
