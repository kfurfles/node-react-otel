import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { producer } from './client';

@Module({
  imports: [],
})
export class KafkaModule implements OnModuleInit, OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await producer.disconnect();
  }
  onModuleInit() {
    this.initKafka();
  }

  initKafka() {
    producer.connect().then(() => {
      console.log('Kafka Iniciado Nestjs');
    });
  }
}
