// actions.js or action file
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../src/context/api"; // Your axios instance

// Action for fetching contest dashboard by ID
export const fetchContestDashboard = createAsyncThunk(
  "board/fetchContestDashboard",
  async (contestId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/board/contest_id/${contestId}`);
      
      
      if (res.status === 200) {
        return res.data;
      } else {
        return rejectWithValue("Failed to fetch contest dashboard");
      }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
