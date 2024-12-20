// actions.js or action file
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../src/context/constant"; // Assuming you have constants for tokens

export const logoutUser = createAsyncThunk(
  "auth/logoutUser", // Action type
  async (_, { rejectWithValue }) => {
    try {
      // Clear tokens from localStorage
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      return true; // Successful logout
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);
