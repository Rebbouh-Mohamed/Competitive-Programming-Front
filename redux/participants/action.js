import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

// Async thunk to get participants of a contest
export const getContestParticipants = createAsyncThunk(
  "contests/getContestParticipants",
  async (contestId, { rejectWithValue }) => {
    try {
      // Make the API call to get participants
      const response = await api.get(`/contests/${contestId}/participants/`);
      if (response.status === 200) {
        console.log(`Participants for contest ${contestId}:`, response.data);
        return response.data; // Return the participants list
      }
      // If the response is not 200, throw an error
      throw new Error("Unable to fetch participants");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An unexpected error occurred"
      );
    }
  }
);
