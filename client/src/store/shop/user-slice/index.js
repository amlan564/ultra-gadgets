// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   user: null,
// };

// export const fetchUser = createAsyncThunk("/user/fetchUser", async (userId) => {
//   const response = await axios.get(
//     `${import.meta.env.VITE_API_URL}/api/shop/user/get/${userId}`
//   );

//   return response?.data;
// });

// export const updateUser = createAsyncThunk(
//   "/user/updateUser",
//   async ({ userId, userName }) => {
//     const response = await axios.put(
//       `${import.meta.env.VITE_API_URL}/api/shop/user/update/${userId}`,
//       { userName }
//     );

//     return response?.data;
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.data;
//       })
//       .addCase(updateUser.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(fetchUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.data;
//       })
//       .addCase(fetchUser.rejected, (state) => {
//         state.isLoading = false;
//         state.user = null;
//       });
//   },
// });

// export default userSlice.reducer;
