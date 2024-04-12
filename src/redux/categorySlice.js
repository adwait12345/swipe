import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    addCategories: (state, action) => {
      state.find((category) => category.name === action.payload.name)
        ? alert("Category already exists")
        :
      state.push(action.payload);
    },
    deleteCategory: (state, action) => {
      return state.filter((category) => category.id !== action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedCategory;
      }
    },
  },
});

export const {
 addCategories,
  deleteCategory,
  updateCategory,
} = categoriesSlice.actions;

export const selectCategory = (state) => state.categories;

export default categoriesSlice.reducer;
