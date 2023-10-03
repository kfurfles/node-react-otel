import { Injectable } from '@nestjs/common';
import { UseCase } from '@/Core/domain/UseCase';
import { SendConfirmationUserDto } from '../dto';
import { EmailService } from '@/modules/email/email.service';
import { createConfirmUserToken } from '@/modules/authorizaation/useCase/tokenuseCase';

@Injectable()
export class SendConfirmationEmailUseCase
  implements UseCase<SendConfirmationUserDto, boolean>
{
  constructor(private readonly emailService: EmailService) {}
  execute(request: SendConfirmationUserDto): Promise<boolean> {
    const { email, id } = request;
    const token = createConfirmUserToken({ email, id });

    const body = `http://localhost:3000/active-account?token=${token}`;
    return this.emailService.sendEmailRaw({
      from: 'system',
      subject: 'Ativação de conta',
      body: body,
      to: email,
    });
  }
}
