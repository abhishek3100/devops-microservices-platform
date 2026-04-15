const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

exports.register = async (data) => {
  const response = await axios.post(
    `${USER_SERVICE_URL}/api/users/register`,
    data
  );
  return response.data;
};

exports.login = async (data) => {
  const response = await axios.post(
    `${USER_SERVICE_URL}/api/users/login`,
    data
  );
  return response.data;
};