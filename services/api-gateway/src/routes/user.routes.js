const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Example protected route
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

module.exports = router;