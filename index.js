const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// Function to register and configure OpenTelemetry SDK
function register(config) {
    // Set up diagnostics logger
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

    // Initialize the NodeSDK with selected instrumentations and endpoint
    const sdk = new NodeSDK({
        traceExporter: new config.traceExporter(),
        instrumentations: getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': config.instruments.includes('http'),
            '@opentelemetry/instrumentation-express': config.instruments.includes('express'),
            '@opentelemetry/instrumentation-mongodb': config.instruments.includes('mongodb'),
        }),
    });

    // Start the SDK
    sdk.start()
        .then(() => console.log('Tracing initialized'))
        .catch((error) => console.error('Error initializing tracing', error));

    return sdk;
}

module.exports = { register };
