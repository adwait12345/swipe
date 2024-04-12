import React from "react";
import { Table } from "antd";

const ProductTable = ({ setSliderOpen, Products }) => {
  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Selling Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <p>{category.length > 0 ? category : "No Category"}</p>
      ),
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
      render: (description) => (
        <p>{description.length > 0 ? description : "No Description"}</p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <button
        className="btn btn-primary px-3"
          onClick={() => {
            setSliderOpen({ open: true, id: record.id, type: "edit" });
          }}
        >
          edit
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      pagination={{ pageSize: "5" }}
      className="fw-medium"
      dataSource={Products}
    />
  );
};
export default ProductTable;
