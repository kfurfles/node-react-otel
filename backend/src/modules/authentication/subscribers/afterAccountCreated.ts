import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

import { EventHandler } from '@/Core/domain/EventHandler';
import {
  AccountCreateEvent,
  EVENT_NAME,
} from '@/modules/account/Events/accountCreate.event';
import { OnEvent } from '@nestjs/event-emitter';

config();

@Injectable()
export class AfterAccountCreated implements EventHandler<AccountCreateEvent> {
  @OnEvent(EVENT_NAME)
  async onReceive(payload: AccountCreateEvent) {
    console.log('event received: {AfterAccountCreated}', payload);
  }
}
