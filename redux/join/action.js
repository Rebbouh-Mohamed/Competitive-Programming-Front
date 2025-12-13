import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

// Async thunk to handle the joining of a contest
export const joinContest = createAsyncThunk(
  "contests/joinContest",
  async (contestId, { rejectWithValue }) => {
    try {
      // Make the API call to join the contest
      const response = await api.post(`/contests/${contestId}/join/`);
      if (response.status === 201) {
        return response.data; // You can return any success data if needed
      }
      // If the response is not 201, reject the join
      throw new Error("Unable to join contest");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An unexpected error occurred"
      );
    }
  }
);
