import React, { useState } from "react";
import { Space, Table } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import { deleteInvoice } from "../../redux/invoicesSlice";
import { useDispatch } from "react-redux";
import Display_Invoice from "../DisplayInvoice";
import { Link } from "react-router-dom";

const InvoiceTable = ({ invoiceList }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Customer",
      dataIndex: "billTo",
      key: "billTo",
    },
    {
      title: "Due Date",
      dataIndex: "dateOfIssue",
      key: "dateOfIssue",
    },
    {
      title: "Bill #",
      key: "invoiceNumber",
      dataIndex: "invoiceNumber",
      render: (invoiceNumber) => <p className="m-0">INV-{invoiceNumber}</p>,
    },
    {
      title: "Action",
      key: "action",
      align: "end",

      render: (record) => (
        <Space size="middle">
          <button
            className="btn border"
            onClick={() => {
              setOpen(true);
              setData(record);
            }}
            style={{ padding: "8px 10px" }}
          >
            <IoEyeOutline /> View
          </button>
          <Link
            to={"/edit/" + record.id}
            className="btn border  "
            style={{ padding: "8px 10px" }}
          >
            <FiEdit /> Edit
          </Link>
          <button
            onClick={() => {
              dispatch(deleteInvoice(record.id));
            }}
            className="btn border  "
            style={{ padding: "8px 10px" }}
          >
            <ImBin />
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={invoiceList} className="fw-medium" />
      <Display_Invoice open={open} setOpen={setOpen} data={data} />
    </>
  );
};
export default InvoiceTable;
