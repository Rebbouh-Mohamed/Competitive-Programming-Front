import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

export const lboard = createAsyncThunk(
  "lboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/board/");
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred"
      );
    }
  }
);
