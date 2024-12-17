import { createSlice } from "@reduxjs/toolkit";
import { testcode } from "./action"; // Ensure you import the correct action

const initialState = {
  percentage:null , // Stores the problems fetched from the API
  isLoading: false,
  error: null,
};

const problemsSlice = createSlice({
  name: "percentage",
  initialState,
    reducers: {}, // No custom reducers in this slice
  extraReducers: (builder) => {
    builder
      .addCase(testcode.pending, (state) => {
        state.isLoading = true; // Set loading state when fetching starts
        state.error = null;
      })
      .addCase(testcode.fulfilled, (state, action) => {
        //console.log("Slice Fulfilled Action:", action);
        state.isLoading = false; // Set loading to false when data is fetched
        state.problems = action.payload; // Save the fetched problems in state
        state.error = null;
      })
      .addCase(testcode.rejected, (state, action) => {
        state.isLoading = false; // Stop loading if there’s an error
        state.error = action.payload || "Failed to fetch problems.";
      });
  },
});


export default problemsSlice.reducer;
