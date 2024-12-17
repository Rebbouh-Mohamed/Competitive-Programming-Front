import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

export const testcode = createAsyncThunk(
  "test",
  async ({problem_id,data}, { rejectWithValue }) => {
    try {
      const response = await api.post(`/problems/${problem_id}/test/`,data);
      if (response.status ===201){
      return response.data;}
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    }
  }
);
