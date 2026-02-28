import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      formData,
      {
        withCredentials: true,
      },
    );

    return response.data;
  },
);

export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    formData,
    {
      withCredentials: true,
    },
  );

  return response.data;
});

export const guestLoginUser = createAsyncThunk(
  "/auth/guest-login",
  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/guest-login`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  },
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  },
);

export const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  const token = JSON.parse(sessionStorage.getItem("token"));

  if (!token) {
    return { success: false };
  }

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );

  return response.data;
});

export const updateUserProfile = createAsyncThunk(
  "/auth/update-profile",
  async ({ userId, formData }) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    return response.data;
  },
);

export const updateUserPassword = createAsyncThunk(
  "/auth/update-password",
  async ({ userId, formData }) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/update-password`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    console.log(response?.data, "from redux password");
    return response.data;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    resetTokenAndCredentials: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(guestLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(guestLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(guestLoginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;
