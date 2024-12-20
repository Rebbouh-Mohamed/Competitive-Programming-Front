import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api"; // Import your axios instance
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from "../../src/context/constant"; // Assuming these are the constants for your tokens

// Action for logging in
export const loginUser = createAsyncThunk(
  "login/loginUser", // Action type
  async (data, { rejectWithValue }) => {
    
    
    try {
      // Make the POST request to the login endpoint
      const res = await api.post("/api/token/", { username: data.username, password: data.password });

      // Check if the status is 200 (OK)
      if (res.status === 200) {
        // Store the access and refresh tokens in localStorage
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem(USERNAME, data.username);

        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Handle any errors, including failed login attempt
      //alert(error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message); // Reject the promise
    } finally {
      // Set loading to false, if you have a loading state to manage
      // setLoading(false); // Uncomment if you have a loading state
    }
  }
);

// Set email and password actions (to store them in the state)
export const setEmail = (email) => ({
  type: "login/setEmail",
  payload: email,
});

export const setPassword = (password) => ({
  type: "login/setPassword",
  payload: password,
});