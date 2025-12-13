// App.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/sections/Navbar.jsx";
import { Provider } from "react-redux";
import { store, authStore } from "../redux/store.js";
import { AppProvider } from "./context/AppContext";
import "./index.css";
import Login from "./pages/Login.jsx";
import Lobby from "./pages/Lobby.jsx";
import LBoard from "./pages/LBoard.jsx";
import GRound from "./pages/GRound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}
function App() {
  const location = useLocation();

  useEffect(() => {
    window.scroll(0, 1);
  }, [location.pathname]);
  function Logged() {
    if (location.pathname !== "/login") 
      return <Navbar />;
    else 
      return <></>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/LBoard" element={<LBoard />} />
        <Route path="/GRound" element={<GRound />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;