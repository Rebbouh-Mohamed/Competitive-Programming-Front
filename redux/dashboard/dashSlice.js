// boardSlice.js or slice file
import { createSlice } from "@reduxjs/toolkit";
import { fetchContestDashboard } from "./action"; // Adjust the import based on your file structure

const initialState = {
  contestData: null, // To store the contest dashboard data
  isLoading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContestDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContestDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contestData = action.payload; // Store the contest data in state
        state.error = null;
      })
      .addCase(fetchContestDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default boardSlice.reducer;
