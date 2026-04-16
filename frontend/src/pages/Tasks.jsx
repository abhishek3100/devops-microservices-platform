import { useState, useEffect } from "react";
import API from "../api/api";

export default function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
  try {
    const res = await API.get("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const createTask = async () => {
    await API.post(
      "/api/tasks",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  useEffect(() => {
  if (token) {
    fetchTasks();
  }
}, [token]);

  return (
  <div className="container">
    <h2>📋 Your Tasks</h2>

    <input
      placeholder="New task..."
      onChange={(e) => setTitle(e.target.value)}
    />

    <button onClick={createTask}>Add Task</button>

    <ul style={{ marginTop: "20px" }}>
      {tasks.map((t) => (
        <li key={t.id} style={{ marginBottom: "10px" }}>
          {t.title} — <b>{t.status}</b>
        </li>
      ))}
    </ul>

    <button onClick={() => setToken(null)}>Logout</button>
  </div>
);
}