import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredienstsReducer } from './slice/ingredients';
import { userReducer } from './slice/user';
import { orderReducer } from './slice/feed';
import { constructorReducer } from './slice/constructor';

const rootReducer = combineReducers({
  ingredients: ingredienstsReducer,
  userAuth: userReducer,
  order: orderReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
