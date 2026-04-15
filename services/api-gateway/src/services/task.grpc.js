const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../../proto/task.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const taskProto = grpc.loadPackageDefinition(packageDefinition).task;

// gRPC client
const client = new taskProto.TaskService(
  process.env.TASK_SERVICE_URL || 'localhost:50051',
  grpc.credentials.createInsecure()
);

// Wrapper functions
exports.createTask = (title) => {
  return new Promise((resolve, reject) => {
    client.CreateTask({ title }, (err, response) => {
      if (err) return reject(err);
      resolve(response.task);
    });
  });
};

exports.getTasks = () => {
  return new Promise((resolve, reject) => {
    client.GetTasks({}, (err, response) => {
      if (err) return reject(err);
      resolve(response.tasks);
    });
  });
};