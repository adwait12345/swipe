import React from 'react'
import Logo from '../../assets/svg/logo'

export default function Navbar() {
  return (
    <div
      className=" position-sticky top-0 z-1 "
      style={{
        height: "48px",
        borderBottom: "1px solid #f1f1f1",
        background: "#ffffff",
        padding: "14px 16px",
      }}
    >
      <Logo />
    </div>
  );
}

