import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

export const testcode = createAsyncThunk(
  "test",
  async ({problem_id,data,is_test}, { rejectWithValue }) => {
    const url = is_test
    ? `/submissions/${problem_id}/run/`
    : `/submissions/${problem_id}/submit/`;
    console.log("API URL:", url);

    try {
      const response = await api.post(url,data);
      if (response.status ===202 || response.status === 200){
      return response.data.data;}
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    }
  }
);
