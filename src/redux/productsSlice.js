import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    addProducts: (state, action) => {
        const { category, name } = action.payload;
    
        // Check if a product with the same name already exists in the category
        const existingProduct = state.find(
          (product) => product.category === category && product.name === name
        );
    
        // If a product with the same name exists in the same category, show an alert
        if (existingProduct) {
          alert("Product already exists in this category");
        } else {
          // Add the new product to the state
          state.push(action.payload);
        }
      
    },
    deleteProduct: (state, action) => {
      return state.filter((product) => product.id !== action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedProduct;
      }
    },
  },
});

export const {
  addProducts,
  deleteProduct,
  updateProduct,
} = productsSlice.actions;

export const selectProduct = (state) => state.products;


export default productsSlice.reducer;
