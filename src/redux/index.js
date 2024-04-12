import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; 
import productReducer from "./productsSlice"; 
import categoryReducer from "./categorySlice";
import groupReducer from "./groupSlice"; 
const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productReducer,
  categories: categoryReducer,
  groups: groupReducer,


});

export default rootReducer;
