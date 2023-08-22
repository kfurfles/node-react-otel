import { Injectable } from '@nestjs/common';
import { produceMessage } from './lib/kafka/message';

@Injectable()
export class AppService {
  getHello() {
    return produceMessage({
      key: 'foo',
      value: new Date().toString(),
    });
  }
}
