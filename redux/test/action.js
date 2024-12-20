import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api";

export const testcode = createAsyncThunk(
  "test",
  async ({problem_id,data,is_test}, { rejectWithValue }) => {
    const url = is_test
    ? `/problems/${problem_id}/test/`
    : `/submissions/${problem_id}/submit/`;
    console.log("API URL:", url);

    try {
      const response = await api.post(url,data);
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
