import { createSlice } from "@reduxjs/toolkit";
import { refreshToken } from "./action"; // Adjust the import based on your file structure

const initialState = {
  accessToken: localStorage.getItem(ACCESS_TOKEN) || null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN) || null,
  isLoading: false,
  error: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken; // Update access token
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default tokenSlice.reducer;
