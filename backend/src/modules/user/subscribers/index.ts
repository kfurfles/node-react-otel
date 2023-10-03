import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_NAME, UserCreateEvent } from '../Events/userCreate.event';
import { SendConfirmationEmailUseCase } from '../useCases/sendConfirmationEmailUseCase';

@Injectable()
export class Subscribers {
  constructor(
    private readonly sendConfirmationEmailUseCase: SendConfirmationEmailUseCase,
  ) {}

  @OnEvent(EVENT_NAME, { async: true, nextTick: true })
  handleUserCreatedEvent({ payload: { email, id } }: UserCreateEvent) {
    return this.sendConfirmationEmailUseCase.execute({ email, id });
  }
}
