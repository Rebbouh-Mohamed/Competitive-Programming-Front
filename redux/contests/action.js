import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

export const getUpcomingContest = createAsyncThunk(
  "contests/getUpcomingContest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contests/upcontest/");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    }
  }
);
