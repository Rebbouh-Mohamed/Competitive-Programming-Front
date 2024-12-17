import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./action"; // Adjust the import based on your file structure

const initialState = {
  email: "",
  password: "",
  isLoading: false,
  error: null,
  token: null,
  userState: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userState = action.payload.userState;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setEmail, setPassword } = loginSlice.actions;

export default loginSlice.reducer;