import React from "react";
import { Link } from "react-router-dom";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { HiOutlineShoppingCart } from "react-icons/hi2";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "210px",
        display: "flex",
        flexDirection: "column",
        padding: "14px 16px",
        gap: "20px",
      }}
    >
      <div
        style={{ fontSize: "1rem" }}
        className="d-flex  flex-column gap-2  fw-normal  "
      >
        <Link
          to="/"
          style={{ fontWeight: "600" }}
          className="w-100  d-flex align-items-center gap-2 text-decoration-none bg-transparent rounded   text-dark "
        >
          <LiaMoneyBillWaveSolid /> Invoices
        </Link>

        <Link
          to="/products"
          style={{ fontWeight: "600" }}
          className="w-100  d-flex align-items-center gap-2 text-decoration-none bg-transparent rounded   text-dark "
        >
          <HiOutlineShoppingCart /> Products & Categories
        </Link>
      </div>
    </div>
  );
}
