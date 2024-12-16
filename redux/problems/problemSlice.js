import { createSlice } from "@reduxjs/toolkit";
import { getproblem } from "./action"; // Ensure you import the correct action

const initialState = {
  problems: [], // Stores the problems fetched from the API
  isLoading: false,
  error: null,
};

const problemsSlice = createSlice({
  name: "problems",
  initialState,
    reducers: {}, // No custom reducers in this slice
  extraReducers: (builder) => {
    builder
      .addCase(getproblem.pending, (state) => {
        state.isLoading = true; // Set loading state when fetching starts
        state.error = null;
      })
      .addCase(getproblem.fulfilled, (state, action) => {
        //console.log("Slice Fulfilled Action:", action);
        state.isLoading = false; // Set loading to false when data is fetched
        state.problems = action.payload; // Save the fetched problems in state
        state.error = null;
      })
      .addCase(getproblem.rejected, (state, action) => {
        state.isLoading = false; // Stop loading if there’s an error
        state.error = action.payload || "Failed to fetch problems.";
      });
  },
});


export default problemsSlice.reducer;
