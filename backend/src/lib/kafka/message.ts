import { traceProvider } from '@/infra/tracing/traceProvider';
import api, { SpanStatusCode } from '@opentelemetry/api';
import { producer } from './client';
import { Message, ProducerRecord } from 'kafkajs';

export async function produceMessage(message: Message) {
  const tracer = traceProvider.getTracer('producer');
  const ctx = api.context.active();
  const span = tracer.startSpan('producer:message');
  const { headers = {} } = message;

  try {
    api.propagation.inject(ctx, message, {
      set(carrier, key, value) {
        carrier.headers = {
          ...headers,
          [key]: value,
        };
      },
    });
    const producerMessage: ProducerRecord = {
      topic: 'envio-email-boasvindas',
      messages: [message],
    };

    const responseMsg = await producer.send(producerMessage);

    responseMsg.forEach((record) => {
      Object.entries(record).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
    });

    console.log('Successfully produced message');

    return responseMsg;
  } catch (error) {
    console.error('Failed to produce message:', error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  } finally {
    span.end();
  }
}
