import { producer } from './client';
import { Message, ProducerRecord } from 'kafkajs';

export async function produceMessage(message: Message) {
  try {
    const producerMessage: ProducerRecord = {
      topic: 'envio-email-boasvindas',
      messages: [message],
    };

    const responseMsg = await producer.send(producerMessage);

    console.log('Successfully produced message');

    return responseMsg;
  } catch (error) {
    console.error('Failed to produce message:', error);
  }
}
