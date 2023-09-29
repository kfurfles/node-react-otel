const {
    SimpleSpanProcessor
  } = require('@opentelemetry/sdk-trace-base');
  const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
  const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
  const { Resource } = require('@opentelemetry/resources');
  const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
  
  const traceExporter = new OTLPTraceExporter({
    url: 'http://3.81.184.154:4318/v1/traces',
  });
  const traceProvider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: `express-otel`,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
    }),
    plugins: {
      kafkajs: { enabled: false, path: 'opentelemetry-plugin-kafkajs' }
    }
  });
  traceProvider.register()
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter))
  
  module.exports = {
    traceExporter, traceProvider  
  }
  