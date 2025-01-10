
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import List from "./Pages/List";
import Board from "./Pages/Board"
import { initializeApp } from "firebase/app";
import "bootstrap/dist/css/bootstrap.min.css";

;

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCJi2qdnGz2XCBpODl2K9oHkJK0Jimirjs",
    authDomain: "alter-office-task-5bf8e.firebaseapp.com",
    projectId: "alter-office-task-5bf8e",
    storageBucket: "alter-office-task-5bf8e.firebasestorage.app",
    messagingSenderId: "949294506294",
    appId: "1:949294506294:web:4531095bd5c00b2dfa9397"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  return (
    <Routes>
      <Route index path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      
      <Route path="/list" element={<List />} />
      <Route path="/board" element={<Board />} />
    </Routes>
  );
}

export default App;
