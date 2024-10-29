import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '@api';

interface IOrderState {
  selectedIngredients: TIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IOrderState = {
  orderRequest: false,
  selectedIngredients: [],
  orderModalData: null
};

type TOrderResponse = {
  order: TOrder;
  name: string;
};

export const makeOrder = createAsyncThunk<TOrderResponse, string[]>(
  'order/new',
  orderBurgerApi
);

export const getOrderData = createAsyncThunk<TOrder, number>(
  'order/get',
  async (idx) => {
    const data = await getOrderByNumberApi(idx);
    const order = data.orders.find((order) => order.number === idx);
    return order!;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.selectedIngredients = [];
    },
    clearOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderData.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
      })
      .addCase(makeOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(makeOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrder: (state) => state.orderModalData
  }
});

export const { resetOrder, clearOrderModalData } = orderSlice.actions;

export const { getOrderRequest, getOrder } = orderSlice.selectors;

export default orderSlice.reducer;
