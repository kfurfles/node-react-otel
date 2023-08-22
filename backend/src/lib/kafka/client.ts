import * as Kafka from 'kafkajs';

export const kafka = new Kafka.Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: 2,
});

export const producer = kafka.producer();
