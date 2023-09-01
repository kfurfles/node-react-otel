import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import * as process from 'process';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

export const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});
export const traceProvider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `nestjs-otel`,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
});
traceProvider.register({});
traceProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
traceProvider.addSpanProcessor(
  new SimpleSpanProcessor(new ConsoleSpanExporter()),
);
