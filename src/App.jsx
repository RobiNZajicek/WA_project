import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { auth } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());

  // Check if user is logged in on mount
  useEffect(() => {
    if (auth.isLoggedIn()) {
      auth.getMe()
        .then(setUser)
        .catch(() => {
          auth.logout();
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData.user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-screen overflow-x-hidden bg-jecna-dark">
        <Routes>
          {/* Home with Navbar */}
          <Route 
            path="/" 
            element={
              <>
                <NavBar isLoggedIn={isLoggedIn} user={user} />
                <Home />
              </>
            } 
          />
          
          {/* Auth pages - with navbar */}
          <Route 
            path="/login" 
            element={
              <>
                <NavBar isLoggedIn={isLoggedIn} user={user} />
                <LoginPage onSuccess={handleLoginSuccess} />
              </>
            } 
          />
          <Route 
            path="/register" 
            element={
              <>
                <NavBar isLoggedIn={isLoggedIn} user={user} />
                <RegisterPage onSuccess={handleLoginSuccess} />
              </>
            } 
          />
          
          {/* Dashboard - own layout */}
          <Route 
            path="/dashboard" 
            element={<DashboardPage user={user} onLogout={handleLogout} />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
