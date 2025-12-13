import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

// Async thunk to handle the joining of a contest
export const getproblem = createAsyncThunk(
  "problems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/problems/problems/`);///problems/problems/
      if (response.status === 200) {
        return response.data.data; // You can return any success data if needed
      }
      // If the response is not 200, reject the join
      throw new Error("mkch prblm");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An unexpected error occurred"
      );
    }
  }
);
