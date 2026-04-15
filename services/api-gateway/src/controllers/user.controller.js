const userService = require('../services/user.service');

exports.register = async (req, res) => {
  try {
    const data = await userService.register(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await userService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message
    });
  }
};