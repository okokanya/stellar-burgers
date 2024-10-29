import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';

interface IFeedsReponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

interface IFeedState {
  orders: TOrder[];
  isLoading: boolean;
  response: IFeedsReponse;
}

const initialState: IFeedState = {
  orders: [],
  isLoading: false,
  response: {
    total: 0,
    totalToday: 0,
    orders: []
  }
};

export const fetchFeeds = createAsyncThunk('feed/fetch', getFeedsApi);

export const fetchUserOrders = createAsyncThunk('feed/fetchUser', getOrdersApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.response = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    getOrders: (state) => state.orders,
    getTodayOrders: (state) => state,
    getIsOrdersLoading: (state) => state.isLoading
  }
});

export const { getOrders, getTodayOrders, getIsOrdersLoading } =
  feedSlice.selectors;

export default feedSlice.reducer;
