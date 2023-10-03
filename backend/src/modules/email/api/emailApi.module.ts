import { Module } from '@nestjs/common';
import { EmailService } from '../email.service';
import { SendEmailUseCase } from '../useCases/sendEmailUseCase';

@Module({
  providers: [EmailService, SendEmailUseCase],
  exports: [EmailService],
})
export class EmailApiModule {}
