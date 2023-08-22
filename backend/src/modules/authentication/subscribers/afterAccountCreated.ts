import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

import { EventHandler } from '@/Core/domain/EventHandler';
import {
  AccountCreateEvent,
  EVENT_NAME,
} from '@/modules/account/Events/accountCreate.event';
import { OnEvent } from '@nestjs/event-emitter';
import { producer } from '@/lib/kafka/client';

config();

@Injectable()
export class AfterAccountCreated implements EventHandler<AccountCreateEvent> {
  @OnEvent(EVENT_NAME)
  async onReceive(payload: AccountCreateEvent) {
    producer.send({
      topic: 'envio-email-boasvindas',
      messages: [
        {
          value: JSON.stringify({ foo: 'zoo' }),
          headers: {
            teste: '123',
          },
          key: new Date().getTime().toString(),
        },
      ],
    });
    console.log('event received: {AfterAccountCreated}', payload);
  }
}
