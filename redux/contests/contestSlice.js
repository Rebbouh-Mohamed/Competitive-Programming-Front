import { createSlice } from "@reduxjs/toolkit";
import { getUpcomingContest } from "./action";

const initialState = {
  upcomingContest: null,
  isLoading: false,
  error: null
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
  }
});

export default contestSlice.reducer;