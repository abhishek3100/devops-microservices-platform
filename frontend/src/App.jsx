import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

function App() {
  const [token, setToken] = useState(null);

  return token ? (
    <Tasks token={token} />
  ) : (
    <Login setToken={setToken} />
  );
}

export default App;