import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import List from "./Pages/List";
import Board from "./Pages/Board";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./Pages/Register";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<Login />} />
      <Route index path="/register" element={<Register />} />

      <Route path="/home" element={<Home />} />

      <Route path="/list" element={<List />} />
      <Route path="/board" element={<Board />} />
    </Routes>
  );
}

export default App;
