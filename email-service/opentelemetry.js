// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const opentelemetry = require("@opentelemetry/sdk-node")
const {getNodeAutoInstrumentations} = require("@opentelemetry/auto-instrumentations-node")
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc')
const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics')
const {alibabaCloudEcsDetector} = require('@opentelemetry/resource-detector-alibaba-cloud')
const {awsEc2Detector, awsEksDetector} = require('@opentelemetry/resource-detector-aws')
const {containerDetector} = require('@opentelemetry/resource-detector-container')
const {gcpDetector} = require('@opentelemetry/resource-detector-gcp')
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');
const {envDetector, hostDetector, osDetector, processDetector} = require('@opentelemetry/resources')
const { traceExporter } = require("./traceProvider")
const { propagation, context, SpanStatusCode } = require('@opentelemetry/api');
const { parseMessage } = require("./helpers")

const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // only instrument fs if it is part of another trace
      '@opentelemetry/instrumentation-fs': {
        requireParentSpan: false,
      },      
    }),
    new KafkaJsInstrumentation({
      consumerHook(span, topic, message){
        span.updateName('consumer')
        const msg = parseMessage(message);  
        Object.entries(msg).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
        span.setStatus({ code: SpanStatusCode.OK, message: error.message });
        span.end();
      },
      producerHook(span, topic, message){}
    })
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({}),
    exportIntervalMillis: 1000000
  }),
  resourceDetectors: [
    containerDetector,
    envDetector,
    hostDetector,
    osDetector,
    processDetector,
    alibabaCloudEcsDetector,
    awsEksDetector,
    awsEc2Detector,
    gcpDetector
  ],
})

sdk.start();

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
