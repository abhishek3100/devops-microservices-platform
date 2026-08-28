const client = require("prom-client");

const register = new client.Registry();

// Default Node.js metrics
client.collectDefaultMetrics({
  register,
  prefix: "api_gateway_",
});

// HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Request duration
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

module.exports = {
  register,
  httpRequestCounter,
  httpRequestDuration,
};