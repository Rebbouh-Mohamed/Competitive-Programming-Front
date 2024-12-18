// Main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { store as reduxStore } from "../redux/store";
import AuthProvider from "react-auth-kit";
import { Provider } from "react-redux";
import createStore from "react-auth-kit/createStore";
import Login from "./pages/Login.jsx";
import Lobby from "./pages/Lobby.jsx";
import LBoard from "./pages/LBoard.jsx";
import GRound from "./pages/GRound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";


const authStore = createStore({
  autName: "auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});
let players = [
  {
    avatar: "https://via.placeholder.com/44x44",
    username: "louai",
    status: "Qualified",
    score: "10",
    highlight: false,
  },
  {
    avatar: "https://via.placeholder.com/44x44",
    username: "You",
    status: "Qualified",
    score: "40",
    highlight: true,
  },
  {
    avatar: "https://via.placeholder.com/44x44",
    username: "sami",
    status: "Qualified",
    score: "80",
    highlight: false,
  },
  {},
];
const problems = [
  { title: "Two Sum", accuracy: 80, difficulty: "Easy" },
  { title: "Binary Search", accuracy: 70, difficulty: "Medium" },
  { title: "Palindrome Number", accuracy: 50, difficulty: "Easy" },
  { title: "Merge Sort", accuracy: 90, difficulty: "Hard" },
];
let Time = {
  startTime: "2024-12-12T20:42:07Z",
  endTime: "2025-02-15T22:10:09Z",
}
let Day = 1;
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      {
        path: "lobby",
        element: (
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        ),
      },
      {
        path: "game-round",
        element: (
          <ProtectedRoute>
            <GRound  Day={Day} Time={Time} />
          </ProtectedRoute>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <ProtectedRoute>
            <LBoard/>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <AuthProvider
        authType="cookie"
        autName="_auth"
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === "https:"}
        store={authStore}
      >
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>
); //building rootes and structures of pages and some acc
// from some old projects and some old idea + new project idea