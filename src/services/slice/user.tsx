import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {} from '@reduxjs/toolkit';

export interface IUserState {
  data: TUser | null;
  isAuthChecked: boolean;
}

const initialState: IUserState = {
  data: null,
  isAuthChecked: false
};

export const checkUserAuth = createAsyncThunk<TUser, void>(
  `user/checkUserAuth`,
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

export const update = createAsyncThunk<TUser, Partial<TUser>>(
  `user/update`,
  async (userData) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const register = createAsyncThunk<TUser, TRegisterData>(
  `user/register`,
  async (registerData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logout = createAsyncThunk<void, void>(`user/logout`, async () => {
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});

export const login = createAsyncThunk<TUser, TLoginData>(
  `user/login`,
  async (loginData) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.isAuthChecked = true;
      })
      .addMatcher(isPending, (state) => {
        state.isAuthChecked = true;
      })
      .addMatcher(isRejected, (state) => {
        state.isAuthChecked = true;
      });
  },
  selectors: {
    getUser: (state) => state.data,
    getIsAuthChecked: (state) => state.isAuthChecked
  }
});

export default userSlice.reducer;

export const { getUser, getIsAuthChecked } = userSlice.selectors;
