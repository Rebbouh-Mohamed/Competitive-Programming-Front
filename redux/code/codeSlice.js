// codingspaceSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchDefaultCode } from "./action"; // adjust path if needed

const initialState = {
  defaultCode: "",         // stores the template string
  language: null,          // optional: keep track of the language returned by backend
  isLoading: false,
  error: null,
};

const codingspaceSlice = createSlice({
  name: "codingspace",
  initialState,
  reducers: {
    // Optional: clear the template manually
    clearDefaultCode: (state) => {
      state.defaultCode = "";
      state.language = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDefaultCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.defaultCode = action.payload.code_snippet;
        state.language = action.payload.language; // you may or may not need this
      })
      .addCase(fetchDefaultCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unknown error";
        state.defaultCode = ""; // optional: reset on error
      });
  },
});

export const { clearDefaultCode } = codingspaceSlice.actions;
export default codingspaceSlice.reducer;