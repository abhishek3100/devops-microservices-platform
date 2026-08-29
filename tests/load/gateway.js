import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "2m",
};

const BASE_URL = "http://host.docker.internal";

export default function () {
  const email = `user${__VU}@test.com`;
  const password = "Password123!";

  // Register (may return 201 or 409 if already exists)
  http.post(
    `${BASE_URL}/api/users/register`,
    JSON.stringify({
      name: `User ${__VU}`,
      email: email,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Login
  const login = http.post(
    `${BASE_URL}/api/users/login`,
    JSON.stringify({
      email: email,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(login, {
    "login successful": (r) => r.status === 200,
  });

  const token = login.json("token");

  if (!token) {
    console.log(`Login failed for ${email}`);
    sleep(1);
    return;
  }

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Health
  http.get(`${BASE_URL}/api/users/health`);

  // Get Tasks
  http.get(`${BASE_URL}/api/tasks`, params);

  // Create Task
  http.post(
    `${BASE_URL}/api/tasks`,
    JSON.stringify({
      title: `Task ${Date.now()}`,
    }),
    params
  );

  sleep(1);
}