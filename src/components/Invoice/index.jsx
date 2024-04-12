import React from "react";
import { HiPlus } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useInvoiceListData } from "../../redux/hooks";
import InvoiceTable from "../InvoiceTable";
import { Tabs } from "antd";

export default function InvoiceTab() {
  const { invoiceList } = useInvoiceListData();

  const items = [
    {
      key: "1",
      label: "All Transactions",
      children: <InvoiceTable invoiceList={invoiceList} />,
    },
    {
      key: "2",
      label: "Pending",
      children: "Content of Tab Pane 2",
      disabled: true,
    },
    {
      key: "3",
      label: "Paid",
      children: "Content of Tab Pane 3",
      disabled: true,
    },
  ];
  return (
    <div className="w-100 h-100 border rounded-3 bg-white d-flex flex-column p-4  ">
      <div className="w-100 d-flex align-items-center justify-content-between  ">
        <p className="fs-4 fw-bold">Invoices</p>
        <Link
          to="create-new"
          className="btn btn-primary px-3 py-2 rounded-3  fw-bold"
        >
          <HiPlus
            style={{ width: "20px", height: "20px", strokeWidth: "1px" }}
          />{" "}
          Create Invoice
        </Link>
      </div>
      <div className="w-100 h-100 ">
        <Tabs
          defaultActiveKey="1"
          items={items}
          style={{ fontWeight: "bold" }}
        />
      </div>
      <div className=""></div>
    </div>
  );
}
