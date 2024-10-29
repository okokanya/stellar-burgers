import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

// export const USER_SLICES_NAME = 'userAuth';

interface IUserState {
  data: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: IUserState = {
  data: null,
  isAuthChecked: false,
  error: null
};

export const fetchRegisterUser = createAsyncThunk(
  `userAuth/fetchRegisterUser`,
  async (data: TRegisterData, { rejectWithValue }) => {
    const dataUser = await registerUserApi(data);
    if (!dataUser.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', dataUser.accessToken);
    localStorage.setItem('refreshToken', dataUser.refreshToken);
    return dataUser.user;
  }
);

export const fetchLoginUser = createAsyncThunk(
  `userAuth/fetchLoginUser`,
  async (data: TLoginData, { rejectWithValue }) => {
    const dataUser = await loginUserApi(data);
    if (!dataUser.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', dataUser.accessToken);
    localStorage.setItem('refreshToken', dataUser.refreshToken);
    return dataUser.user;
  }
);

export const fetchForgotPassword = createAsyncThunk(
  `userAuth/fetchForgotPassword`,
  async (data: { email: string }, { rejectWithValue }) => {
    const dataUser = await forgotPasswordApi(data);
    if (!dataUser.success) {
      return rejectWithValue(data);
    }
    return dataUser.success;
  }
);

export const fetchGetUser = createAsyncThunk(
  `userAuth/fetchGetUser`,
  async () => getUserApi()
);

export const fetchLogoutUser = createAsyncThunk(
  `userAuth/fetchLogoutUser`,
  async () => logoutApi()
);

export const fetchUpdateUser = createAsyncThunk(
  `userAuth/fetchUpdateUser`,
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const checkUserAuth = createAsyncThunk(
  `userAuth/checkUserAuth`,
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchGetUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

const userSlice = createSlice({
  name: `userAuth`,
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUser: (state) => state.data,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.data = action.payload;
      })
      .addCase(fetchRegisterUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Не удалось зарегистрировать пользователя';
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.data = action.payload;
      })
      .addCase(fetchLoginUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Не удалось войти';
      })
      .addCase(fetchGetUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.data = action.payload.user;
      })
      .addCase(fetchGetUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Не удалось получить данные о пользователе';
      })
      .addCase(fetchLogoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.error = null;
        state.data = null;
        localStorage.clear();
        deleteCookie('accessToken');
      })
      .addCase(fetchLogoutUser.rejected, (state) => {
        state.error = 'Не удалось выйти из аккаунта';
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.data = null;
        state.error = null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.error = null;
        state.data = action.payload.user;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.error = 'Не удалось обновить пользователя';
      });
  }
});

export const userReducer = userSlice.reducer;
export const { getUser, getIsAuthChecked } = userSlice.selectors;
export const { authChecked } = userSlice.actions;
