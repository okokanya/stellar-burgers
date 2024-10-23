import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { TIngredient } from '@utils-types';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    purgeIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    addToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() }
      })
    },
    deleteFromConstructor: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient._id === action.payload
      );

      if (index !== -1) {
        state.ingredients.splice(index, 1);
      }
    },
    moveIngredientUp: (state, action) => {
      const { ingredients } = state;
      const index = action.payload;
      if (index > 0 && index < ingredients.length) {
        const temp = ingredients[index];
        ingredients[index] = ingredients[index - 1];
        ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action) => {
      const { ingredients } = state;
      const index = action.payload;
      if (index >= 0 && index < ingredients.length - 1) {
        const temp = ingredients[index];
        ingredients[index] = ingredients[index + 1];
        ingredients[index + 1] = temp;
      }
    }
  }
});

export default constructorSlice.reducer;

export const {
  moveIngredientDown,
  moveIngredientUp,
  addToConstructor,
  deleteFromConstructor,
  purgeIngredients
} = constructorSlice.actions;
