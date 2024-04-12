import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import generateRandomId from "../../../utils/generateRandomId";
import { addCategories, selectCategory } from "../../../redux/categorySlice";
import { useSelector } from "react-redux";

export default function Category_Sliderbar({
  CategorySliderOpen,
  setCategorySliderOpen,
}) {
  const [isOpen, setIsOpen] = useState({
    background: "z-3 visually-hidden",
    right: "-800px",
  });

  let dispatch = useDispatch();
  const categories = useSelector(selectCategory);

  const [categoryData, setCategoryData] = useState({
    id: generateRandomId(),
    name: "",
    description: "",
  });

  useEffect(() => {
    if (CategorySliderOpen.open) {
      setIsOpen({ background: "z-3", right: "0" });
    } else {
      setIsOpen({ background: "z-3", right: "-800px " });
      setTimeout(() => {
        setIsOpen({ background: " visually-hidden", right: "-800px" });
      }, 300);
    }
  }, [CategorySliderOpen.open]);

  function handleSubmit(event) {
    event.preventDefault();
    if (categories?.length === 0) {
      dispatch(addCategories({ id: generateRandomId(), ...categoryData }));
      setCategorySliderOpen({ open: false });
      setCategoryData({ id: generateRandomId(), name: "", description: "" });
    } else if (categories.length > 0) {
      dispatch(addCategories({ id: generateRandomId(), ...categoryData }));
      setCategorySliderOpen({ open: false });
      setCategoryData({ id: generateRandomId(), name: "", description: "" });
      return 0;
    }
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
          setCategorySliderOpen({ open: false });
        }}
        style={{ width: "50%" }}
      ></div>

      <form
        onSubmit={handleSubmit}
        className=" position-relative h-100"
        style={{ width: "800px" }}
      >
        <div
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
                  setCategorySliderOpen({ open: false });
                }}
              />
              <span className=" fs-5 fw-bold ">Category</span>
            </div>
            <button
              type="submit"
              className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
            >
              Add Category
            </button>
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
                    <span style={{ color: "red" }}>*</span> Category{" "}
                  </label>
                  <input
                    placeholder="Enter Item Name"
                    className="form-control border rounded-3  px-2 py-2 w-100 bg-white"
                    type="text"
                    value={categoryData.name}
                    onChange={(e) =>
                      setCategoryData({ ...categoryData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="row w-100    rounded-3 gap-2 ">
                <div className=" d-flex flex-column  gap-1 w-100  ">
                  <label className=" fw-bold d-flex align-items-start gap-1  ">
                    {" "}
                    Description{" "}
                  </label>
                  <textarea
                    placeholder="Add product description here..."
                    className="form-control border rounded-3  bg-white "
                    type="text"
                    value={categoryData.description}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="position-absolute bg-white bottom-0 w-100 px-4 py-3 border-top ">
            <button
              type="submit"
              className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
            >
              Add Category
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
