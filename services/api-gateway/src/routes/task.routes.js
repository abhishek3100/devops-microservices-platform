const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, taskController.createTask);
router.get('/', verifyToken, taskController.getTasks);

module.exports = router;