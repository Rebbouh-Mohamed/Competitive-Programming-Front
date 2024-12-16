import { createSlice } from "@reduxjs/toolkit";
import { getUpcomingContest, joinContest } from "./action";

const initialState = {
  upcomingContest: null,
  isLoading: false,
  error: null,
  isJoining: false, // Add this to track join state
  joinError: null // Track join-specific errors
};

const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUpcomingContest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUpcomingContest.fulfilled, (state, action) => {
        console.log("Slice Fulfilled Action:", action);
        state.isLoading = false;
        state.upcomingContest = action.payload;
        state.error = null;
      })
      .addCase(getUpcomingContest.rejected, (state, action) => {
        console.error("Slice Rejected Action:", action);
        state.isLoading = false;
        state.upcomingContest = null;
        state.error = action.payload || "Error fetching contest";
      })
      .addCase(joinContest.pending, (state) => {
        state.isJoining = true;
        state.joinError = null;
      })
      .addCase(joinContest.fulfilled, (state, action) => {
        console.log("Successfully joined contest:", action);
        state.isJoining = false;
      })
      .addCase(joinContest.rejected, (state, action) => {
        console.error("Error joining contest:", action);
        state.isJoining = false;
        state.joinError = action.payload || "Error joining contest";
      });
  }
});

export default contestSlice.reducer;
