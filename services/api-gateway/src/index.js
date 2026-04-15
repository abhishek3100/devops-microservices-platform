const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});