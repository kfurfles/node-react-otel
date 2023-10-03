import { Injectable, Optional } from '@nestjs/common';
import { SendEmailDto } from './dto';
import { SendEmailUseCase } from './useCases/sendEmailUseCase';

@Injectable()
export class EmailService {
  constructor(
    @Optional() private readonly sendEmailUseCase: SendEmailUseCase,
  ) {}

  sendEmailRaw(createUserDto: SendEmailDto) {
    return this.sendEmailUseCase.execute(createUserDto);
  }
}
