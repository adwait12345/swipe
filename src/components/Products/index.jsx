import { FaArrowRight } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi2";
import { HiPlusCircle } from "react-icons/hi";
import generateRandomId from "../../utils/generateRandomId";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useInvoiceListData } from "../../redux/hooks";

import React, { useEffect, useState } from "react";
import Ant_Table from "../AntTable";
import { addInvoice, updateInvoice } from "../../redux/invoicesSlice";
import { selectProduct } from "../../redux/productsSlice";
import { selectCategory } from "../../redux/categorySlice";
import { Dropdown } from "antd";

import { Checkbox } from "antd";
import SCBox from "../ScanBox";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { selectGroup } from "../../redux/groupSlice";

function Products({
  SliderOpen,
  setSliderOpen,
  CategorySliderOpen,
  setCategorySliderOpen,
  GroupSliderOpen,
  setGroupSliderOpen,
}) {
  const dispatch = useDispatch();
  const Products = useSelector(selectProduct);
  const categories = useSelector(selectCategory);
  const Groups = useSelector(selectGroup);

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = location.pathname.includes("edit");

  const { getOneInvoice, listSize } = useInvoiceListData();

  const [enableGrouping, setEnableGrouping] = useState(
    isEdit
      ? getOneInvoice(params.id) && getOneInvoice(params.id).hasGroups
      : false
  );

  const [selectedProduct, setSelectedProduct] = useState({
    category: "",
    product: "",
    group: "",
    id: "",
    quantity: "",
    discountAmount: "",
    price: "",
  });

  let filteredProducts;

  // Filter the Products array based on the selected category
  if (selectedProduct && selectedProduct.category) {
    filteredProducts = Products.filter((product) => {
      return product.category === selectedProduct.category;
    });
  } else {
    // If no category is selected, return the original Products array
    filteredProducts = Products;
  }

  const [formData, setFormData] = useState(
    isEdit
      ? JSON.parse(JSON.stringify(getOneInvoice(params.id)))
      : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "0",
          taxAmount: "0.00",
          discountRate: "0",
          discountAmount: "0.00",
          currency: "$",
          hasGroups: false,
          items: [],
        }
  );

  const [groupformData, setGroupformData] = useState(
    isEdit
      ? JSON.parse(JSON.stringify(getOneInvoice(params.id)))
      : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "0",
          taxAmount: "0.00",
          discountRate: "0",
          discountAmount: "0.00",
          hasGroups: true,
          groups: [],
        }
  );

  const [groups, setGroups] = useState(
    isEdit
      ? groupformData?.groups
      : [
          {
            id: generateRandomId(),
            name: "",
            description: "",
            quantity: "0",
            total: "0",
            productIds: [],
          },
        ]
  );
  useEffect(() => {
    if (enableGrouping) {
      setGroupformData({ ...groupformData, groups: [...groups] });

      handleCalculateTotal_for_group();
    } else if (!enableGrouping) {
      handleCalculateTotal();
    }
  }, [
    selectedProduct.category,
    Products.category,
    selectedProduct.product,
    selectedProduct.quantity,
    formData.total,
    formData.items,
    groups,
    groupformData.total,
    groupformData.taxRate,
    enableGrouping,
  ]);

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const handleCalculateTotal_for_group = () => {
    let subTotal = 0;
    groups.forEach((group) => {
      subTotal += parseFloat(group.total);
    });

    setGroupformData((prevFormData) => {
      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        total: total,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
      };
    });
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;
      let data = Products.filter((item) => {
        return formData.items.some((prod) => prod.prodId === item.id);
      }).map((product) => ({
        ...product,
        // Merge the quantity from the group into the product data
        quantity:
          formData.items.find((prod) => prod.prodId === product.id)?.quantity ||
          0,
        netAmount:
          formData.items.find((prod) => prod.prodId === product.id)?.quantity *
            product.price || 0,
      }));
      data.forEach((item) => {
        subTotal += parseFloat(item.price).toFixed(2) * parseInt(item.quantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (enableGrouping) {
      if (isEdit) {
        dispatch(
          updateInvoice({
            id: groupformData.id,
            updatedInvoice: { ...groupformData },
          })
        );
        alert("Invoice updated successfuly 🥳");
      } else {
        dispatch(addInvoice(groupformData));
        alert("Invoice added successfuly 🥳");
      }
      navigate("/");
    } else if (!enableGrouping) {
      if (isEdit) {
        dispatch(
          updateInvoice({ id: formData.id, updatedInvoice: { ...formData } })
        );
        alert("Invoice updated successfuly 🥳");
      } else {
        dispatch(addInvoice(formData));
        alert("Invoice added successfuly 🥳");
      }
      navigate("/");
    }
  };

  function Open_Product_Slider() {
    setSliderOpen({ open: true, id: "", type: "create" });
  }

  function SetTableData(grp, idx) {
    if (enableGrouping) {
      if (selectedProduct.group === "") return alert("Please select a Group");
      else if (selectedProduct.product === "")
        return alert("Please select a product");

      const filteredGroupIndex = groups.findIndex((group) => {
        return group.id === grp.id;
      });

      if (filteredGroupIndex !== -1) {
        const filteredGroup = { ...groups[filteredGroupIndex] };

        const existingIndex = filteredGroup.productIds.findIndex(
          (item) => item.prodId === selectedProduct.id
        );

        let updatedProductIds = [...filteredGroup.productIds];

        if (existingIndex !== -1) {
          const updatedProduct = { ...updatedProductIds[existingIndex] };
          updatedProduct.quantity = filteredGroup.quantity;
          updatedProductIds[existingIndex] = updatedProduct;
        } else {
          updatedProductIds = [
            ...filteredGroup.productIds,
            {
              prodId: selectedProduct.id,
              quantity: filteredGroup.quantity,
              price: selectedProduct.price,
            },
          ];
        }

        let updatedGroup = {
          ...filteredGroup,
          name: selectedProduct.group,
          productIds: updatedProductIds,
        };

        setGroups((prevGroups) => {
          const updatedGroups = [...prevGroups];
          updatedGroups[filteredGroupIndex] = updatedGroup;
          return updatedGroups;
        });
      }
    } else if (!enableGrouping) {
      if (selectedProduct.product === "")
        return alert("Please select a product");
      // Find the index of the existing prodId in the productIds array
      const existingIndex = formData.items.findIndex(
        (item) => item.prodId === selectedProduct.id
      );

      // Create a copy of the productIds array
      let updatedProductIds = [...formData.items];

      // If the prodId exists in the array, update its quantity
      if (existingIndex !== -1) {
        updatedProductIds[existingIndex].quantity = selectedProduct.quantity;
      } else {
        // If the prodId doesn't exist, add a new entry with the prodId and quantity
        updatedProductIds = [
          ...formData.items,
          {
            prodId: selectedProduct.id,
            quantity: selectedProduct.quantity,
            price: selectedProduct.price,
          },
        ];
      }
      // Create the updated object with the updated productIds array
      let updated = {
        ...formData,

        items: updatedProductIds,
      };

      // Update the groups state with the updated group
      setFormData(updated);

      handleCalculateTotal();
    }
  }

  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: generateRandomId(),
        name: "",
        description: "",
        quantity: "0",
        total: "0",
        productIds: [],
      },
    ]);
  };

  const removeGroupById = (groupId) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);
  };

  return (
    <form
      onSubmit={handleAddInvoice}
      className=" w-100  bg-white rounded-4 border p-3 d-flex flex-column align-items-center   gap-3   "
    >
      <div
        className="row w-100 d-flex align-items-center justify-content-between bg-white position-sticky  z-2 py-3  "
        style={{ top: "48px" }}
      >
        <div className="col">
          <p className="fw-bold ">Invoice #</p>
          {isEdit ? (
            <></>
          ) : (
            <Checkbox
              onChange={() => setEnableGrouping(!enableGrouping)}
              checked={enableGrouping}
              style={{ fontSize: "12px" }}
            >
              Enable Grouping
            </Checkbox>
          )}
        </div>
        <div className="col-auto d-flex align-items-center gap-3 ">
          <button
            className="btn btn-light px-3 py-2 rounded-3 border bg-white fw-bold "
            style={{ color: "#606770" }}
          >
            Save and Print
          </button>
          <button
            type="submit"
            className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
          >
            Save <FaArrowRight />
          </button>
        </div>
      </div>
      <div
        className="row w-100 d-flex align-items-center   "
        style={{ paddingLeft: "20px" }}
      >
        <div className="p-0 w-100 d-flex flex-column gap-4">
          {enableGrouping ? (
            <div
              className="row w-100  px-1 py-3  rounded-3 gap-2 "
              style={{ background: "#E6F2FF" }}
            >
              <div className="row w-100  d-flex align-items-start justify-content-between  ">
                <div className="col d-flex flex-column  gap-1   ">
                  <label className="  fw-medium  ">Add New Customer </label>
                  <input
                    name="billTo"
                    value={groupformData.billTo}
                    onChange={(e) =>
                      setGroupformData({
                        ...groupformData,
                        billTo: e.target.value,
                      })
                    }
                    placeholder="Who is this invoice to?"
                    className="form-control border rounded-3 bg-white px-2 py-2 w-100"
                    type="text"
                  />
                </div>
                <div className="col d-flex flex-column  gap-1 ">
                  <label className=" fw-medium  ">Invoice Date </label>
                  <input
                    id="startDate"
                    defaultValue={new Date().toISOString().substr(0, 10)}
                    className="form-control border rounded-3 px-2 py-2 bg-white w-100"
                    type="date"
                  />
                </div>
                <div className="col d-flex flex-column  gap-1 ">
                  <label className=" fw-medium  ">Due Date </label>
                  <input
                    value={groupformData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) =>
                      setGroupformData({
                        ...groupformData,
                        dateOfIssue: e.target.value,
                      })
                    }
                    className="form-control border rounded-3 px-2 py-2 bg-white w-100"
                    type="date"
                  />
                </div>
                <div className="col d-flex flex-column  gap-1">
                  <label className=" fw-medium  ">
                    Customers Email Address{" "}
                  </label>
                  <input
                    placeholder="Email address"
                    onChange={(e) =>
                      setGroupformData({
                        ...groupformData,
                        billToEmail: e.target.value,
                      })
                    }
                    name="billToEmail"
                    value={groupformData.billToEmail}
                    className="form-control border rounded-3 px-2 py-2 bg-white w-100"
                    type="email"
                  />
                </div>
              </div>
              <div className="col d-flex flex-column  gap-1  ">
                <label className=" fw-medium">Customer Billing Address </label>

                <textarea
                  placeholder="Set customers billing address"
                  className="form-control border rounded-3 px-2 py-2 w-50 bg-white"
                  onChange={(e) =>
                    setGroupformData({
                      ...groupformData,
                      billToAddress: e.target.value,
                    })
                  }
                  name="billToAddress"
                  value={groupformData.billToAddress}
                  type="text"
                />
              </div>
            </div>
          ) : (
            <div
              className="row w-100  px-1 py-3  rounded-3 gap-2 "
              style={{ background: "#E6F2FF" }}
            >
              <div className="row w-100  d-flex align-items-start justify-content-between  ">
                <div className="col d-flex flex-column  gap-1   ">
                  <label className="  fw-medium  ">Add New Customer </label>
                  <input
                    name="billTo"
                    value={formData.billTo}
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    placeholder="Who is this invoice to?"
                    className="form-control border rounded-3 bg-white px-2 py-2 w-100"
                    type="text"
                  />
                </div>
                <div className="col d-flex flex-column  gap-1 ">
                  <label className=" fw-medium  ">Invoice Date </label>
                  <input
                    id="startDate"
                    defaultValue={new Date().toISOString().substr(0, 10)}
                    className="form-control border rounded-3 px-2 py-2 bg-white w-100"
                    type="date"
                  />
                </div>
                <div className="col d-flex flex-column  gap-1 ">
                  <label className=" fw-medium  ">Due Date </label>
                  <input
                    value={formData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    className="form-control border rounded-3 px-2 py-2 bg-white w-100"
                    type="date"
                  />
                </div>
                <div className="col d-flex flex-column  gap-1">
                  <label className=" fw-medium  ">
                    Customers Email Address{" "}
                  </label>
                  <input
                    placeholder="Email address"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    name="billToEmail"
                    value={formData.billToEmail}
                    className="form-control border rounded-3 px-2 py-2 bg-white w-100"
                    type="email"
                  />
                </div>
              </div>
              <div className="col d-flex flex-column  gap-1  ">
                <label className=" fw-medium">Customer Billing Address </label>

                <textarea
                  placeholder="Set customers billing address"
                  className="form-control border rounded-3 px-2 py-2 w-50 bg-white"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  name="billToAddress"
                  value={formData.billToAddress}
                  type="text"
                />
              </div>
            </div>
          )}
          {enableGrouping ? (
            groups.map((group, index) => {
              const items = [
                {
                  key: "1",
                  label: (
                    <p
                      className="btn btn-danger w-100"
                      onClick={() => {
                        removeGroupById(group.id);
                      }}
                    >
                      Delete
                    </p>
                  ),
                },
              ];

              return (
                <div
                  id={group.id}
                  key={group.id}
                  className="row w-100  px-1 py-3 d-flex flex-column px-3 rounded-3 gap-3 "
                  style={{ background: "#E6F2FF" }}
                >
                  <div className="w-100  d-flex align-items-end justify-content-between gap-4 p-0  ">
                    <div className="w-50 d-flex flex-column w-50  gap-3">
                      <div className="d-flex align-items-center gap-4">
                        <label className=" fw-bold  ">Select Products </label>
                        <span
                          onClick={Open_Product_Slider}
                          className="d-flex align-items-center  gap-1  "
                          style={{ cursor: "pointer" }}
                        >
                          <HiPlusCircle /> Add new Product?
                        </span>
                      </div>
                      <div className="d-flex w-100 align-items-center justify-content-center p-0 m-0 gap-2  ">
                        <SCBox
                          keyname="group"
                          data={Groups}
                          placeholder="Search groups"
                          state={GroupSliderOpen}
                          setState={setGroupSliderOpen}
                          newEventName="Add New Group"
                          localdata={selectedProduct}
                          setlocaldata={setSelectedProduct}
                        />

                        <SCBox
                          keyname="category"
                          data={categories}
                          placeholder="All Categories"
                          state={CategorySliderOpen}
                          setState={setCategorySliderOpen}
                          newEventName="Add New Category"
                          localdata={selectedProduct}
                          setlocaldata={setSelectedProduct}
                        />

                        <SCBox
                          keyname="product"
                          data={filteredProducts}
                          placeholder="Search products"
                          state={SliderOpen}
                          setState={setSliderOpen}
                          newEventName="Add New Product"
                          localdata={selectedProduct}
                          setlocaldata={setSelectedProduct}
                        />
                      </div>
                    </div>

                    <div className="col w-100  d-flex flex-column   gap-3">
                      <label className=" fw-bold  ">Quantity </label>

                      <input
                        placeholder="Qty"
                        name="quantity"
                        onChange={(e) => (group.quantity = e.target.value)}
                        className="form-control border rounded-3  px-2 py-2 w-100 bg-white"
                        type="number"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-end  gap-3 ">
                      <Dropdown menu={{ items }} placement="bottomRight" arrow>
                        <HiOutlineDotsVertical
                          style={{
                            cursor: "pointer",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      </Dropdown>
                      <button
                        type="button"
                        onClick={() => SetTableData(group, index)}
                        className=" btn-primary px-3 py-2 rounded-3 d-flex align-items-center gap-1 fw-bold"
                      >
                        <HiPlus
                          style={{
                            width: "20px",
                            height: "20px",
                            strokeWidth: "1px",
                          }}
                        />{" "}
                        Add to Bill
                      </button>
                    </div>
                  </div>
                  <div className="w-100  rounded-3 p-0  ">
                    <Ant_Table
                      editField={editField}
                      Products={Products}
                      groupformData={groupformData}
                      setGroupformData={setGroupformData}
                      enableGrouping={enableGrouping}
                      Groups={Groups}
                      groups={groups}
                      group={group}
                      index={index}
                      setGroups={setGroups}
                      selectedProduct={selectedProduct}
                      handleCalculateTotal_for_group={
                        handleCalculateTotal_for_group
                      }
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="row w-100  px-1 py-3 d-flex flex-column px-3 rounded-3 gap-3 "
              style={{ background: "#E6F2FF" }}
            >
              <div className="w-100  d-flex align-items-end justify-content-between gap-4 p-0  ">
                <div className="w-50 d-flex flex-column w-50  gap-3">
                  <div className="d-flex align-items-center gap-4">
                    <label className=" fw-bold  ">Select Products </label>
                    <span
                      onClick={Open_Product_Slider}
                      className="d-flex align-items-center  gap-1  "
                      style={{ cursor: "pointer" }}
                    >
                      <HiPlusCircle /> Add new Product?
                    </span>
                  </div>
                  <div className="d-flex w-100 align-items-center justify-content-center p-0 m-0 gap-2  ">
                    <SCBox
                      keyname="category"
                      data={categories}
                      placeholder="All Categories"
                      state={CategorySliderOpen}
                      setState={setCategorySliderOpen}
                      newEventName="Add New Category"
                      localdata={selectedProduct}
                      setlocaldata={setSelectedProduct}
                    />

                    <SCBox
                      keyname="product"
                      data={filteredProducts}
                      placeholder="Search products"
                      state={SliderOpen}
                      setState={setSliderOpen}
                      newEventName="Add New Product"
                      localdata={selectedProduct}
                      setlocaldata={setSelectedProduct}
                    />
                  </div>
                </div>

                <div className="col   d-flex flex-column   gap-3">
                  <label className=" fw-bold  ">Quantity </label>
                  <input
                    placeholder="Qty"
                    name="quantity"
                    value={selectedProduct.quantity}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        quantity: e.target.value,
                      })
                    }
                    className="form-control border rounded-3  px-2 py-2 w-100 bg-white"
                    type="number"
                  />
                </div>
                <button
                  type="button"
                  onClick={SetTableData}
                  className=" btn-primary px-3 py-2 rounded-3 d-flex align-items-center gap-1 fw-bold"
                >
                  <HiPlus
                    style={{
                      width: "20px",
                      height: "20px",
                      strokeWidth: "1px",
                    }}
                  />{" "}
                  Add to Bill
                </button>
              </div>
              <div className="w-100  rounded-3 p-0  ">
                <Ant_Table
                  formData={formData}
                  editField={editField}
                  Products={Products}
                  setFormData={setFormData}
                />
              </div>
            </div>
          )}

          {enableGrouping && (
            <button
              onClick={addGroup}
              className="border rounded fw-medium py-1 d-flex align-items-center justify-content-center gap-1"
              type="button"
              style={{
                marginLeft: "-10px",
                width: "100%",
                background: "#EFEAFF",
              }}
            >
              <HiPlus /> Add new group
            </button>
          )}
          <div className="row w-100  d-flex align-items-start gap-3">
            <div className="col w-50  d-flex flex-column gap-3 border rounded-3 p-0">
              <label
                className=" p-3  w-100 fw-bold border-bottom rounded-top-3  "
                style={{ background: "#FBFBFA" }}
              >
                Notes{" "}
              </label>
              <div className="px-3 pb-3 ">
                <textarea
                  placeholder="Thank you for your business!"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="form-control border rounded-3  px-2 py-2  w-100"
                  style={{ height: "140px" }}
                  type="text"
                />
              </div>
            </div>
            {enableGrouping ? (
              <div
                className="col w-50 d-flex flex-column gap-3 border rounded-3 px-3 py-3 "
                style={{ background: "#E7F3ED", color: "#606770" }}
              >
                <div className="w-25 align-self-end  ">
                  <div className=" rounded-bottom-3 d-flex flex-column  ">
                    <label
                      className="mb-1 mx-1 fw-bold align-self-end "
                      style={{ fontSize: "10px", color: "#606770" }}
                    >
                      Tax rate{" "}
                    </label>

                    <div className="input-group ">
                      <input
                        type="number"
                        name="taxRate"
                        className="form-control border bg-white"
                        // value={groupformData.taxRate}
                        onChange={(e) =>
                          setGroupformData({
                            ...groupformData,
                            taxRate: e.target.value,
                          })
                        }
                        aria-describedby="basic-addon2"
                      />
                      <span
                        className="input-group-text fw-medium bg-white "
                        id="basic-addon2"
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="w-100 d-flex align-items-center "
                  style={{ lineHeight: "10px" }}
                >
                  <div className="w-50">
                    <p className="fw-bold ">Taxable Amount:</p>
                    <p className="fw-bold ">Sub Total:</p>
                    <p className="fw-bold fs-4  text-dark  ">Total Amount:</p>
                    <p className="fw-bold mb-0 ">Discount:</p>
                  </div>
                  <div className="w-50 d-flex flex-column  align-items-end  justify-content-end ">
                    <p>{groupformData.taxAmount}</p>
                    <p>{groupformData.subTotal}</p>
                    <p className=" fs-4 fw-bold text-dark  ">
                      ₹ {Number(groupformData.total).toFixed(2)}
                    </p>
                    <p className="mb-0 fw-bold ">
                      ₹ {groupformData.discountAmount}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="col w-50 d-flex flex-column gap-3 border rounded-3 px-3 py-3 "
                style={{ background: "#E7F3ED", color: "#606770" }}
              >
                <div className="w-25 align-self-end  ">
                  <div className=" rounded-bottom-3 d-flex flex-column  ">
                    <label
                      className="mb-1 mx-1 fw-bold align-self-end "
                      style={{ fontSize: "10px", color: "#606770" }}
                    >
                      Tax rate{" "}
                    </label>

                    <div className="input-group ">
                      <input
                        type="number"
                        name="taxRate"
                        className="form-control border bg-white"
                        value={formData.taxRate}
                        onChange={(e) =>
                          editField(e.target.name, e.target.value)
                        }
                        aria-describedby="basic-addon2"
                      />
                      <span
                        className="input-group-text fw-medium bg-white "
                        id="basic-addon2"
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="w-100 d-flex align-items-center "
                  style={{ lineHeight: "10px" }}
                >
                  <div className="w-50">
                    <p className="fw-bold ">Taxable Amount:</p>
                    <p className="fw-bold ">Sub Total:</p>
                    <p className="fw-bold fs-4  text-dark  ">Total Amount:</p>
                    <p className="fw-bold mb-0 ">Discount:</p>
                  </div>
                  <div className="w-50 d-flex flex-column  align-items-end  justify-content-end ">
                    <p>{formData.taxAmount}</p>
                    <p>{formData.subTotal}</p>
                    <p className=" fs-4 fw-bold text-dark  ">
                      ₹ {Number(formData.total).toFixed(2)}
                    </p>
                    <p className="mb-0 fw-bold ">₹ {formData.discountAmount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="row w-100 border rounded-3 px-5 py-4 d-flex align-items-center ">
            <div className="col fs-4 fw-bold">
              <span style={{ color: "#606770" }}>TOTAL </span>
              <span>
                ₹ {enableGrouping ? groupformData.total : formData.total}
              </span>
            </div>
            <div className="col-auto d-flex align-items-center gap-3 ">
              <button
                className="btn btn-light px-3 py-2 rounded-3 border bg-white fw-bold fs-5  "
                style={{ color: "#606770" }}
              >
                Save and Print
              </button>
              <button className="btn btn-primary px-3 py-2 rounded-3  fw-bold fs-5">
                Save <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Products;
