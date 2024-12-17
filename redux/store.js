// Redux/store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";
import createStore from "react-auth-kit/createStore";
import problemSlice from "./problems/problemSlice"
import testSlice from "./test/testSlice"
import { Percent } from "@mui/icons-material";
// React Auth Kit store setup
const authStore = createStore({
  authName: "_auth", // Name of the cookie for storing authentication data
  authType: "cookie", // Type of storage (cookie)
  cookieDomain: window.location.hostname, // Domain for the cookie
  cookieSecure: window.location.protocol === "https:", // Secure if using HTTPS
});

// Initial state for login
const initialLoginState = {
  email: "",
  password: "",
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create the loginSlice for managing login state
const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    loginRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state) {
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginFailure(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout(state) {
      state.email = "";
      state.password = "";
      state.isAuthenticated = false;
    },
  },
});

// Contests slice initial state
const initialContestsState = {
  upcomingContest: null,
  isLoading: false,
  error: null,
};

// Create the contestsSlice for managing contests state
const contestsSlice = createSlice({
  name: "contests",
  initialState: initialContestsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase("contests/getUpcomingContest/pending", (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase("contests/getUpcomingContest/fulfilled", (state, action) => {
        state.isLoading = false;
        state.upcomingContest = action.payload;
        state.error = null;
      })
      .addCase("contests/getUpcomingContest/rejected", (state, action) => {
        state.isLoading = false;
        state.upcomingContest = null;
        state.error = action.payload || "Error fetching contest";
      });
  },
});

export const {
  setEmail,
  setPassword,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} = loginSlice.actions;

// Create Redux store with both login and contests slices
const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    contests: contestsSlice.reducer, 
    problems:problemSlice,// Add contests slice here
    percentage:testSlice,
  },
});

// Export Redux store and React Auth Kit store
export { store, authStore };  
