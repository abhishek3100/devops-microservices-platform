const taskService = require('../services/task.grpc');

exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;

    const task = await taskService.createTask(title);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks();

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};