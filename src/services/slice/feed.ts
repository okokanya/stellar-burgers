import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// const ORDER_SLICE_NAME = 'order';

interface IFeedState {
  orders: TOrder[];
  userOrders: TOrder[];
  orderRequestData: TOrder | null;
  orderInfo: TOrder | null;
  total: number | null;
  totalToday: number | null;
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
}

const initialState: IFeedState = {
  orders: [],
  userOrders: [],
  total: null,
  totalToday: null,
  isLoading: false,
  error: null,
  orderRequest: false,
  orderRequestData: null,
  orderInfo: null
};

export const fetchGetAllOreders = createAsyncThunk(
  `order/fetchGetAllOreders`,
  async () => getFeedsApi()
);

export const fetchGetAllUserOreders = createAsyncThunk(
  `order/fetchGetAllUserOreders`,
  async () => getOrdersApi()
);

export const fetchOrderBurgerApi = createAsyncThunk(
  `order/fetchOrderBurgerApi`,
  async (data: string[]) => {
    const order = await orderBurgerApi(data);
    return order;
  }
);

export const fetchGetOrderByNumber = createAsyncThunk(
  `order/fetchGetOrderByNumber`,
  async (id: number) => getOrderByNumberApi(id)
);

const oredersSlice = createSlice({
  name: `order`,
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderRequestData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    getOrders: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToDay: (state) => state.totalToday,
    getUserOrders: (state) => state.userOrders,
    getOrderInfo: (state) => state.orderInfo,
    getOrderRequestData: (state) => state.orderRequestData,
    getOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllOreders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetAllOreders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchGetAllOreders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось получить заказы';
      })
      .addCase(fetchGetAllUserOreders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetAllUserOreders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchGetAllUserOreders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось получить заказы';
      })
      .addCase(fetchOrderBurgerApi.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderBurgerApi.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderRequestData = action.payload.order;
      })
      .addCase(fetchOrderBurgerApi.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Не удалось oтправить заказ';
      })
      .addCase(fetchGetOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchGetOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderInfo = action.payload.orders[0];
      })
      .addCase(fetchGetOrderByNumber.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Не удалось oтправить заказ';
      });
  }
});

export const orderReducer = oredersSlice.reducer;
export const {
  getOrders,
  getTotal,
  getTotalToDay,
  getUserOrders,
  getOrderRequestData,
  getOrderRequest,
  getOrderInfo
} = oredersSlice.selectors;
export const { clearOrderData } = oredersSlice.actions;
