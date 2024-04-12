import React, { useEffect, useState } from "react";

import { Button, Drawer, Space } from "antd";
import Logo from "../../assets/svg/logo";
import { useSelector } from "react-redux";
import { selectProduct } from "../../redux/productsSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadOutlined } from "@ant-design/icons";

const GenerateInvoice = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

export default function Display_Invoice({ setOpen, open, data }) {
  const Products = useSelector(selectProduct);

  const [combiner, setCombiner] = useState({
    subtotal: "",
    tax: "",
    discount: "",
    total: "",
  });

  const [placement, setPlacement] = useState("right");

  useEffect(() => {
    if (!data.hasGroups) {
      if (data.items) {
        // Calculate the total amount whenever the data or Products change
        const subTotal = data.items?.reduce((total, item) => {
          const product = Products.find(
            (product) => product.id === item.prodId
          ).price;
          return total + item.quantity * product;
        }, 0);

        const taxAmount = parseFloat(subTotal * (data.taxRate / 100)).toFixed(
          2
        );
        const discountAmount = parseFloat(
          subTotal * (data.discountRate / 100)
        ).toFixed(2);
        const total = (
          subTotal -
          parseFloat(discountAmount) +
          parseFloat(taxAmount)
        ).toFixed(2);

        setCombiner({
          subtotal: subTotal,
          tax: taxAmount,
          discount: discountAmount,
          total: total,
        });
      }
    } else if (data.hasGroups) {
      if (data.groups) {
        // Calculate subtotal for each group
        const groupSubtotals = data.groups.map((group) => {
          // Calculate subtotal for each product in the group
          const groupTotal = group.productIds.reduce((total, product) => {
            // Find the product with matching prodId from the Products array
            const matchedProduct = Products.find(
              (p) => p.id === product.prodId
            );
            // If a matching product is found, use its price to calculate the subtotal
            if (matchedProduct) {
              const productPrice = parseFloat(matchedProduct.price);
              return total + productPrice * parseInt(product.quantity);
            }
            return total;
          }, 0);
          return parseFloat(groupTotal);
        });

        // Calculate subtotal for all groups
        const subTotal = groupSubtotals.reduce(
          (total, subtotal) => total + subtotal,
          0
        );

        // Calculate total tax amount and discount amount
        const taxAmount = parseFloat(
          subTotal * (parseFloat(data.taxRate) / 100)
        ).toFixed(2);
        // const discountAmount = parseFloat(subTotal * (parseFloat(data.discountRate) / 100)).toFixed(2);

        // Calculate total
        const total = (
          parseFloat(subTotal) -
          // parseFloat(discountAmount) +
          parseFloat(taxAmount)
        ).toFixed(2);

        // Set the calculated values in the combiner state
        setCombiner({
          subtotal: subTotal,
          tax: taxAmount,
          // discount: discountAmount,
          total: total,
        });
      }
    }
  }, [data, Products, data.hasGroups]);


  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title="Download Invoice"
        placement={placement}
        width={600}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button icon={<DownloadOutlined />} onClick={GenerateInvoice}>
              Download
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        {data.hasGroups ? (
          <div
            id="invoiceCapture"
            className="w-100 h-100 d-flex flex-column gap-4 bg-white border p-4 overflow-y-scroll "
          >
            <div className="w-100 d-flex align-items-center">
              <div className="d-flex w-50 flex-column h-100 gap-5">
                <div className="d-flex flex-column">
                  <h5 className="m-0">Invoice</h5>
                  <p className="fst-italic">INV-{data.invoiceNumber}</p>
                  <p style={{ fontSize: "12px", margin: "0" }}>
                    {data.currentDate}
                  </p>
                </div>
                <div className="d-flex flex-column">
                  <h6>To</h6>
                  <p style={{ margin: "0" }}>{data.billTo}</p>
                  <p style={{ fontSize: "12px", margin: "0" }}>
                    {data.billToAddress}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      margin: "0",
                      fontWeight: "bold",
                    }}
                  >
                    {data.billToEmail}
                  </p>
                </div>
              </div>
              <div className="d-flex w-50 flex-col h-100">
                <div className="w-100 d-flex flex-column align-items-end justify-content-start">
                  <Logo />
                  <p
                    className=""
                    style={{ textAlign: "right", fontSize: "12px" }}
                  >
                    Address: 201, Swipe Park View, Sri Shyam Nagar, Telecom
                    Nagar Extension, Gachibowli, Hyderabad, Telangana 500032
                  </p>
                  <div
                    className="d-flex flex-column"
                    style={{ textAlign: "right", fontSize: "12px" }}
                  >
                    <h6>Due Date</h6>
                    <p className="m-0 fw-medium">{data.dateOfIssue}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-100">
              {Array.isArray(data.groups) &&
                data.groups.map((group, groupIndex) => {
                  return (
                    <>
                      <h6 className="w-100 bg-info-subtle m-0 p-2  ">
                        {group.name}
                      </h6>
                      <table className="w-100  table table-bordered m-0 ">
                        <thead className="w-100">
                          <tr>
                            <th className="px-2">Items</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th
                              style={{
                                textAlign: "right",
                                paddingRight: "10px",
                              }}
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(group.productIds) &&
                            group.productIds.map((product, productIndex) => {
                              // Assuming productIds contains valid product IDs
                              const productDetails = Products.find(
                                (prod) => prod.id === product.prodId
                              );
                              return (
                                <tr key={`${groupIndex}-${productIndex}`}>
                                  <td className="px-2">
                                    {productDetails ? productDetails.name : ""}
                                  </td>
                                  <td>{product.quantity}</td>
                                  <td>{productDetails.price}</td>
                                  <td
                                    style={{
                                      textAlign: "right",
                                      paddingRight: "10px",
                                    }}
                                  >
                                    {product.quantity * productDetails.price}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      <p className="w-100 d-flex align-items-end justify-content-end px-2 py-3 fw-bold">
                        <span style={{ width: "90.39px", textAlign: "left" }}>
                          Total:
                        </span>{" "}
                        <span style={{ width: "128.24px", textAlign: "right" }}>
                          ₹{" "}
                          {group.productIds.reduce((total, product) => {
                            const productDetails = Products.find(
                              (prod) => prod.id === product.prodId
                            );
                            return (
                              total +
                              product.quantity *
                                (productDetails ? productDetails.price : 0)
                            );
                          }, 0)}
                        </span>
                      </p>{" "}
                    </>
                  );
                })}
            </div>
            <div
              className="w-100 d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              <div className="">
                {data.notes ? data.notes : <p>Thank you for Shopping !!</p>}
              </div>
              <div className="d-flex justify-content-end gap-5">
                <div className="d-flex flex-column">
                  <p className="m-0">Subtotal</p>
                  <p className="m-0">Tax</p>
                  {/* <p className="m-0">Discount</p> */}
                  <h4 className="m-0">Total</h4>
                </div>
                <div
                  className="d-flex flex-column"
                  style={{ textAlign: "right" }}
                >
                  <p className="m-0">₹ {combiner.subtotal}</p>
                  <p className="m-0">₹ {combiner.tax}</p>
                  {/* <p className='m-0'>₹ {combiner.discount}</p> */}
                  <h4 className="m-0">₹ {combiner.total}</h4>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="invoiceCapture"
            className="w-100 h-100 d-flex flex-column gap-4   bg-white border p-4  "
          >
            <div className="w-100  d-flex align-items-center ">
              <div className="d-flex w-50 flex-column h-100 gap-5 ">
                <div className="d-flex flex-column  ">
                  <h5 className="m-0">Invoice</h5>
                  <p className=" fst-italic   ">INV-{data.invoiceNumber}</p>
                  <p style={{ fontSize: "12px", margin: "0" }}>
                    {data.currentDate}
                  </p>
                </div>
                <div className="d-flex flex-column ">
                  <h6>To</h6>
                  <p style={{ margin: "0" }}>{data.billTo}</p>
                  <p style={{ fontSize: "12px", margin: "0" }}>
                    {data.billToAddress}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      margin: "0",
                      fontWeight: "bold",
                    }}
                  >
                    {data.billToEmail}
                  </p>
                </div>
              </div>
              <div className="d-flex w-50 flex-col h-100  ">
                <div className="w-100 d-flex flex-column align-items-end   justify-content-start">
                  <Logo />
                  <p
                    className=""
                    style={{ textAlign: "right", fontSize: "12px" }}
                  >
                    Address: 201, Swipe Park View, Sri Shyam Nagar, Telecom
                    Nagar Extension, Gachibowli, Hyderabad, Telangana 500032
                  </p>
                  <div
                    className="d-flex flex-column"
                    style={{ textAlign: "right", fontSize: "12px" }}
                  >
                    <h6>Due Date</h6>
                    <p className="m-0 fw-medium ">{data.dateOfIssue}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <table className="w-100 h-75  table table-bordered">
                <thead>
                  <tr>
                    <th className="px-2">Items</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th style={{ textAlign: "right", paddingRight: "10px" }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data.items) ? (
                    data.items.map((item, index) => {
                      const product = Products.find(
                        (product) => product.id === item.prodId
                      );
                      return (
                        <tr key={index}>
                          <td className="px-2">
                            {product ? product.name : ""}
                          </td>
                          <td>{item.quantity}</td>
                          <td>{product ? product.price : ""}</td>
                          <td
                            style={{ textAlign: "right", paddingRight: "10px" }}
                          >
                            {item.quantity * product.price}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4">No items available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div
              className="w-100 d-flex justify-content-between "
              style={{ fontSize: "12px" }}
            >
              <div className="">
                {data.notes ? data.notes : <p>Thank you for Shopping !!</p>}
              </div>
              <div className="d-flex justify-content-end gap-5">
                <div className="d-flex flex-column">
                  <p className="m-0">Subtotal</p>
                  <p className="m-0">Tax</p>
                  <p className="m-0">Discount</p>
                  <h4 className="m-0">Total</h4>
                </div>
                <div
                  className="d-flex flex-column"
                  style={{ textAlign: "right" }}
                >
                  <p className="m-0">₹ {combiner.subtotal}</p>
                  <p className="m-0">₹ {combiner.tax}</p>
                  <p className="m-0">₹ {combiner.discount}</p>
                  <h4 className="m-0">₹ {combiner.total}</h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
