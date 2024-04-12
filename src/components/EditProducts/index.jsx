import React, { useState } from "react";
import ProductTable from "../ProductTable";
import { useSelector } from "react-redux";
import { selectProduct } from "../../redux/productsSlice";
import { Tabs } from "antd";

export default function EditProducts({ setSliderOpen }) {
  const [searchTerm, setSearchTerm] = useState("");

  const rawProducts = useSelector(selectProduct);

  const Products = rawProducts.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const items = [
    {
      key: "1",
      label: "Products",
      children: (
        <ProductTable Products={Products} setSliderOpen={setSliderOpen} />
      ),
    },
    {
      key: "2",
      label: "Categories",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Groups",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="w-100 h-100 border rounded-3 bg-white d-flex flex-column p-4  ">
      <div className="">
        <p className="fs-4 fw-bold">Product Inventory</p>
      </div>
      <div className="w-100 h-100 ">
        <div className="tab-content w-100 h-100 " id="nav-tabContent">
          <div className="w-100 h-100  ">
            <div className="d-flex align-items-center  justify-content-between px-1 py-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control border rounded-3  px-2 py-2 w-25 bg-white"
                placeholder="Search product"
              />

              <button
                onClick={() => {
                  setSliderOpen({ open: true, type: "create" });
                }}
                className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
              >
                Add Item
              </button>
            </div>
            <div className="">
              <Tabs
                defaultActiveKey="1"
                items={items}
                style={{ fontWeight: "bold" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}
