import "./App.css";
import ChatBox from "./Component/ChatBox";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./Component/Login";
import { useState } from "react";
import SideNav from "./Component/SideNav";
import Home from "./Component/Home";

function App() {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  const handleLogin = () => {
    setIsAuthenticate(true);
  };

  const ProtectedRoute = ({ element, path }) => {
    return isAuthenticate ? element : <Navigate to="/" replace state={{ from: path }} />;
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login onLoginSuccess={handleLogin} status={true} />}
          />
          
          {/* Define protected routes */}
          <Route
            path="/chat"
            element={<ProtectedRoute element={<ChatBox />} path="/chat" />}
          />
          
          <Route
            path="/home"
            element={<ProtectedRoute element={<Home />} path="/home" />}
          />
          
          <Route
            path="/navbar"
            element={<ProtectedRoute element={<SideNav />} path="/navbar" />}
          />
          
          {/* Logout route */}
          <Route
            path="/logout"
            element={<ProtectedRoute element={<Login onLoginSuccess={handleLogin} status={false} />} path="/logout" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;