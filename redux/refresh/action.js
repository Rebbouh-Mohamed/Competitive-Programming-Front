import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api"; // Your axios instance
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../src/context/constant"; // Constants for your tokens

// Action for refreshing the token
export const refreshToken = createAsyncThunk(
  "login/refreshToken", // Action type
  async (_, { rejectWithValue }) => {
    try {
      // Get the stored refresh token from localStorage
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!refreshToken) {
        return rejectWithValue("No refresh token found");
      }

      // Make the POST request to the refresh endpoint
      const res = await api.post("/api/api/token/refresh", { refresh: refreshToken });

      // Check if the status is 200 (OK)
      if (res.status === 200) {
        // Store the new access token in localStorage
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        return { accessToken: res.data.access };
      } else {
        return rejectWithValue("Failed to refresh token");
      }
    } catch (error) {
      // Handle any errors during the refresh process
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
