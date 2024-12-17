import { createSlice } from "@reduxjs/toolkit";
import { getUpcomingContest, joinContest, getContestParticipants } from "./action";

const initialState = {
  upcomingContest: null,
  isLoading: false,
  error: null,
  isJoining: false,
  joinError: null,
  participants: [], // List of contest participants
  isFetchingParticipants: false, // Track participant fetching state
  participantsError: null // Track errors related to fetching participants
};

const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle upcoming contest actions
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
      // Handle join contest actions
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
      })
      // Handle get participants actions
      .addCase(getContestParticipants.pending, (state) => {
        state.isFetchingParticipants = true;
        state.participantsError = null;
      })
      .addCase(getContestParticipants.fulfilled, (state, action) => {
        console.log("Fetched participants:", action);
        state.isFetchingParticipants = false;
        state.participants = action.payload; // Set the fetched participants
        state.participantsError = null;
      })
      .addCase(getContestParticipants.rejected, (state, action) => {
        console.error("Error fetching participants:", action);
        state.isFetchingParticipants = false;
        state.participants = [];
        state.participantsError = action.payload || "Error fetching participants";
      });
  }
});

export default contestSlice.reducer;
