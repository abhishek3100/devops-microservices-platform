const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []; // temporary in-memory DB

exports.register = async ({ email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(user);

  return { id: user.id, email: user.email };
};

exports.login = async ({ email, password }) => {
  const user = users.find(u => u.email === email);

  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  return token;
};