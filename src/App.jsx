import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/sections/Navbar.jsx";
import { AppProvider } from "./context/AppContext"; // Import the context provider
import "./index.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scroll(0, 1);
  }, [location.pathname]);

  const renderNavbar = () => {
    return location.pathname !== "/login" ? <Navbar /> : null;
  };

  return (
    <AppProvider>
      <div className="content">
        {renderNavbar()}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
