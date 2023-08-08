import { Injectable, Optional } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { CreateUserUseCase } from './useCases/createUserUseCase';

@Injectable()
export class UserService {
  constructor(
    @Optional() private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  create(createUserDto: CreateUserDto) {
    const { lastname, name, picture } = createUserDto;
    return this.createUserUseCase.execute({
      lastname,
      name,
      picture,
    });
  }
}
