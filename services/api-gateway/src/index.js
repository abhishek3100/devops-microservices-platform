const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');


dotenv.config();

const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const metricsMiddleware = require("./middleware/metrics");
app.use(metricsMiddleware);
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});
const { register } = require("./metrics/metrics");

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});