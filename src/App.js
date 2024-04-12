import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import Home from "./layout/home";
import Products from "./components/Products";
import Product_Sliderbar from "./components/SliderBar/Product";
import Category_Sliderbar from "./components/SliderBar/Category";
import EditProducts from "./components/EditProducts";
import InvoiceTab from "./components/Invoice";
import Group_Sliderbar from "./components/SliderBar/Group";

const App = () => {
  const [SliderOpen, setSliderOpen] = useState({
    open: false,
    id: "",
    type: "",
  });
  const [CategorySliderOpen, setCategorySliderOpen] = useState({
    open: false,
    id: "",
    type: "",
  });
  const [GroupSliderOpen, setGroupSliderOpen] = useState({
    open: false,
    id: "",
    type: "",
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<InvoiceTab />} />
          <Route
            path="/create-new"
            element={
              <Products
                SliderOpen={SliderOpen}
                setSliderOpen={setSliderOpen}
                CategorySliderOpen={CategorySliderOpen}
                setCategorySliderOpen={setCategorySliderOpen}
                GroupSliderOpen={GroupSliderOpen}
                setGroupSliderOpen={setGroupSliderOpen}
              />
            }
          />
          <Route
            path="/products"
            element={
              <EditProducts
                SliderOpen={SliderOpen}
                setSliderOpen={setSliderOpen}
                CategorySliderOpen={CategorySliderOpen}
                setCategorySliderOpen={setCategorySliderOpen}
                GroupSliderOpen={GroupSliderOpen}
                setGroupSliderOpen={setGroupSliderOpen}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <Products
                SliderOpen={SliderOpen}
                setSliderOpen={setSliderOpen}
                CategorySliderOpen={CategorySliderOpen}
                setCategorySliderOpen={setCategorySliderOpen}
                GroupSliderOpen={GroupSliderOpen}
                setGroupSliderOpen={setGroupSliderOpen}
              />
            }
          />
        </Route>
      </Routes>

      <Product_Sliderbar
        setSliderOpen={setSliderOpen}
        SliderOpen={SliderOpen}
        CategorySliderOpen={CategorySliderOpen}
        setCategorySliderOpen={setCategorySliderOpen}
      />
      <Category_Sliderbar
        CategorySliderOpen={CategorySliderOpen}
        setCategorySliderOpen={setCategorySliderOpen}
      />
      <Group_Sliderbar
        GroupSliderOpen={GroupSliderOpen}
        setGroupSliderOpen={setGroupSliderOpen}
      />
    </>
  );
};

export default App;
