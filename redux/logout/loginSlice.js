// authSlice.js or slice file
import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "./action"; // Adjust import based on your file structure

const initialState = {
  isAuthenticated: true, // Assuming user is authenticated initially
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false; // Set isAuthenticated to false after logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default authSlice.reducer;
