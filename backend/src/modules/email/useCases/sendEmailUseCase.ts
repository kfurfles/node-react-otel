import { UseCase } from '@/Core/domain/UseCase';
import { SendEmailDto } from '../dto';

export class SendEmailUseCase implements UseCase<SendEmailDto, boolean> {
  async execute(request: SendEmailDto): Promise<boolean> {
    const { from, to, body, subject } = request;
    const sender = await this.getSenderEmail(from);

    const fullEmail = `Send email on ${new Date()}\n 
    from: ${sender}\n
    to: ${to}\n
    subject: ${subject}\n
    body: ${body}`;

    console.log(fullEmail);
    return true;
  }

  private async getSenderEmail(senderKey: SendEmailDto['from']) {
    return `${senderKey}@app.com.br`;
  }
}
