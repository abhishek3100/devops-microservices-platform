const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "user-service",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

