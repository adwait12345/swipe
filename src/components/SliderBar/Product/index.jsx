import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import generateRandomId from "../../../utils/generateRandomId";
import { useDispatch, useSelector } from "react-redux";
import {
  addProducts,
  deleteProduct,
  selectProduct,
  updateProduct,
} from "../../../redux/productsSlice";
import { selectCategory } from "../../../redux/categorySlice";
import SCBox from "../../ScanBox";

export default function Product_Sliderbar({
  setSliderOpen,
  SliderOpen,
  CategorySliderOpen,
  setCategorySliderOpen,
}) {
  const [isOpen, setIsOpen] = useState({
    background: "z-3 visually-hidden",
    right: "-1000px",
  });

  let dispatch = useDispatch();
  const categories = useSelector(selectCategory);
  const Products = useSelector(selectProduct);

  const [pageStyle, setPageStyle] = useState({
    title: "",
    button: "",
  });

  const [productData, setProductData] = useState({
    id: generateRandomId(),
    name: "",
    price: "",
    category: "",
    description: "",
    quantity: "1",
    netAmount: "0",
  });

  useEffect(() => {
    if (SliderOpen.open) {
      setIsOpen({
        background: "z-3",
        right: `${CategorySliderOpen.open ? "200px" : "0px"}`,
      });
    } else {
      setIsOpen({ background: "z-3", right: "-1000px " });
      setTimeout(() => {
        setIsOpen({ background: " visually-hidden", right: "-1000px" });
      }, 300);
    }

    if (SliderOpen.open) {
      switch (SliderOpen.type) {
        case "edit":
          setPageStyle({
            title: "Edit Item",
            button: "Update Item",
          });
          setProductData({
            ...Products.find((item) => item.id === SliderOpen.id),
          });
          break;
        case "create":
          setPageStyle({
            title: "Add Item",
            button: "Add Item",
          });
          break;
        default:
          setPageStyle({
            title: "Add Item",
            button: "Add Item",
          });
          break;
      }
    }
  }, [
    SliderOpen.open,
    SliderOpen.type,
    SliderOpen.id,
    CategorySliderOpen.open,
  ]);

  function handleSubmit(event) {
    event.preventDefault();
    if (SliderOpen.type === "edit") {
      dispatch(
        updateProduct({ id: SliderOpen.id, updatedProduct: { ...productData } })
      );

      setSliderOpen({ open: false });
      setProductData({
        id: generateRandomId(),
        name: "",
        price: "",
        category: "",
        description: "",
      });
    } else if (SliderOpen.type === "create") {
      dispatch(addProducts({ id: generateRandomId(), ...productData }));
      setSliderOpen({ open: false });
      setProductData({
        id: generateRandomId(),
        name: "",
        price: "",
        category: "",
        description: "",
      });
    }
  }

  function handleDelete() {
    dispatch(deleteProduct(SliderOpen.id));
    setSliderOpen({ open: false });
    setProductData({
      id: generateRandomId(),
      name: "",
      price: "",
      category: "",
      description: "",
    });
  }

  return (
    <div
      className={
        ` position-fixed top-0 w-100   d-flex align-items-center ` +
        isOpen.background
      }
      style={{ height: "100%", background: "rgb(0 0 0 / 45%)" }}
    >
      <div
        className="h-100  "
        onClick={() => {
          setSliderOpen({ open: false });
        }}
        style={{ width: "40%" }}
      ></div>
      <div className=" position-relative  h-100" style={{ width: "1000px" }}>
        <form
          onSubmit={handleSubmit}
          className="h-100 d-flex flex-column align-items-center position-absolute w-100 "
          style={{
            right: isOpen.right,
            transition: "0.3s ",
            background: "#FBFBFA",
          }}
        >
          <div className="d-flex w-100 align-items-center justify-content-between px-4 py-3 position-sticky top-0 border-bottom bg-white ">
            <div className="d-flex align-items-center gap-3">
              <IoClose
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#757575",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSliderOpen({ open: false });
                }}
              />
              <span className=" fs-5 fw-bold ">{pageStyle.title}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              {SliderOpen.type === "edit" && (
                <button
                  onClick={handleDelete}
                  type="button"
                  className="btn btn-danger  px-3 py-2 rounded-3  fw-bold"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
              >
                {pageStyle.button}
              </button>
            </div>
          </div>
          <div className="w-100 px-4 d-flex flex-column  gap-3 py-4 ">
            <label
              className="fw-bold "
              style={{ color: "#757575", fontSize: "14px" }}
            >
              {" "}
              Basic Details
            </label>
            <div
              className="w-100 border rounded d-flex flex-column gap-4 bg-white p-3"
              style={{ color: "#606770" }}
            >
              <div className="row w-100    rounded-3 gap-2 ">
                <div className=" d-flex flex-column  gap-1   ">
                  <label className=" fw-bold d-flex align-items-start gap-1  ">
                    {" "}
                    <span style={{ color: "red" }}>*</span> Item Name{" "}
                  </label>
                  <input
                    placeholder="Enter Item Name"
                    required
                    value={productData.name}
                    onChange={(e) =>
                      setProductData({ ...productData, name: e.target.value })
                    }
                    className="form-control border rounded-3  px-2 py-2 w-100 bg-white"
                    type="text"
                  />
                </div>
              </div>
              <div className="row w-100    rounded-3 row-gap-4 ">
                <div className="col d-flex flex-column  gap-1   ">
                  <label className=" fw-bold d-flex align-items-start gap-1  ">
                    {" "}
                    <span style={{ color: "red" }}>*</span> Selling Price{" "}
                  </label>
                  <div className="input-group ">
                    <span
                      className="input-group-text bg-white"
                      id="basic-addon1"
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      className="form-control border bg-white "
                      value={productData.price}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          price: e.target.value,
                        })
                      }
                      placeholder="Enter Selling Price"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <span
                    className="fw-medium"
                    style={{ fontSize: "10px", paddingLeft: "10px" }}
                  >
                    Inclusive of Taxes
                  </span>
                </div>
                <div className="col  d-flex flex-column  gap-1  ">
                <label className=" fw-bold d-flex align-items-start gap-1  ">
                 Select Category{" "}
                  </label>
                <SCBox
                  keyname="category"
                  data={categories}
                  placeholder="All Categories"
                  state={CategorySliderOpen}
                  setState={setCategorySliderOpen}
                  newEventName="Add New Category"
                  localdata={productData}
                  setlocaldata={setProductData}
                />
                </div>

                <div className="row w-100    rounded-3 gap-2 ">
                  <div className=" d-flex flex-column  gap-1 w-100  ">
                    <label className=" fw-bold d-flex align-items-start gap-1  ">
                      {" "}
                      Description{" "}
                    </label>
                    <textarea
                      placeholder="Add product description here..."
                      value={productData.description}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          description: e.target.value,
                        })
                      }
                      className="form-control border rounded-3  bg-white "
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="position-absolute bg-white bottom-0 w-100 px-4 py-3 border-top ">
            <button
              type="submit"
              className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
            >
              {pageStyle.button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
