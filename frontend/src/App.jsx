import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Sign";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import "./App.css";
import "./pages/Auth.css";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content" aria-live="polite">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sign" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
