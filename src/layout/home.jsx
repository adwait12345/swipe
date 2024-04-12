import React from "react";
import Sidebar from "../components/Sidebar/index";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/index";

export default function Home() {
  return (
    <div className="d-flex flex-column w-100" style={{}}>
      <Navbar />
      <div className="w-100 d-flex h-100">
        <div className="" style={{ width: "fit-content" }}>
          <Sidebar />
        </div>
        <div className=" p-4  " style={{ width: "100%", height: "full" }}>
          <Outlet />
        </div>{" "}
      </div>
    </div>
  );
}
