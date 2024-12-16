// actions.js or action file
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api"; // Your axios instance

// Action for posting default code based on problem ID and selected language
export const postDefaultCode = createAsyncThunk(
  "codingspace/postDefaultCode", // Action type
  async ({ problemId, language }, { rejectWithValue }) => {
    try {
      // Make the POST request to fetch the default code for the problem
      const res = await api.get(`/codingspace/${problemId}/language/${language}`);

      // Check if the status is 200 (OK)
      if (res.status === 200) {
        return res.data; // Return the default code for the selected language
      } else {
        return rejectWithValue("Failed to fetch default code");
      }
    } catch (error) {
      // Handle errors
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
