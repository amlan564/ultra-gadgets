import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  relatedProducts: [],
  featuredProducts: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }) => {
    // const query = new URLSearchParams({
    //   ...filterParams,
    //   sortBy: sortParams,
    // });

    // Format filterParams for the query string
    const query = new URLSearchParams();

    // Handle category filter
    if (filterParams.category && filterParams.category.length) {
      query.append("category", filterParams.category.join(","));
    }

    // Handle price filter
    if (filterParams.price && filterParams.price.length === 2) {
      query.append("price", filterParams.price.join(","));
    }

    // Add sort parameter
    query.append("sortBy", sortParams);

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`,
    );

    return result?.data;
  },
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`,
    );

    return result?.data;
  },
);

export const fetchRelatedProducts = createAsyncThunk(
  "/products/fetchRelatedProducts",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}/related`,
    );

    return result?.data;
  },
);

export const fetchFeaturedProducts = createAsyncThunk(
  "/products/fetchFeaturedProducts",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/featured`,
    );

    return result?.data;
  },
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedProducts = action.payload.data;
      })
      .addCase(fetchRelatedProducts.rejected, (state) => {
        state.isLoading = false;
        state.relatedProducts = [];
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.data;
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.isLoading = false;
        state.featuredProducts = [];
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
