// codingspaceSlice.js or slice file
import { createSlice } from "@reduxjs/toolkit";
import { postDefaultCode } from "./action"; // Adjust the import based on your file structure

const initialState = {
  defaultCode: null, // To store the default code
  isLoading: false,
  error: null,
};

const codingspaceSlice = createSlice({
  name: "codingspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postDefaultCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postDefaultCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.defaultCode = action.payload; // Store the default code in state
        state.error = null;
      })
      .addCase(postDefaultCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default codingspaceSlice.reducer;
