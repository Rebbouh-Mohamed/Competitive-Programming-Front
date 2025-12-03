// actions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api"; // Your axios instance

/**
 * Fetch the default/template code for a problem using the new endpoint
 * POST /codingspace/generate-template/
 * Body: { problem_id: number, language: string }
 * Response: { template: string, language: string }
 */
export const postDefaultCode = createAsyncThunk(
  "codingspace/fetchDefaultCode",
  async ({ problemId, language }, { rejectWithValue }) => {
    try {
      const response = await api.post("/codingspace/generate-template/", {
        problem_id: problemId,
        language: language,
      });

      // The backend returns { template: "...", language: "..." }
      // We'll return just the template string for simplicity,
      // but you can also return the whole object if you need the language later.
      return {
        code_snippet: response.data.template || "",
        language: response.data.language,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch template"
      );
    }
  }
);