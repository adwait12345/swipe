import React, { useEffect, useState } from "react";

export default function Footer({
  formData,
  editField,
  enableGrouping,
  groups,
  setGroups,
  index,
  combined,
}) {
  let [Total, setTotal] = useState(0);

  useEffect(() => {
    if (enableGrouping) {
      // Calculate the total
      const total = combined.reduce((acc, item) => {
        return acc + item.netAmount;
      }, 0);

      // Create a new array with the updated group object
      const updatedGroups = groups.map((grp, idx) => {
        if (idx === index) {
          return { ...grp, total: total };
        }
        return grp;
      });

      // Update the state with the new array
      setGroups(updatedGroups);
      setTotal(total);
    }
  }, [combined]);

  return (
    <div className=" rounded-bottom-3 ">
      {enableGrouping ? (
        <div className="w-100 d-flex align-items-end justify-content-end    ">
          <div
            className=" w-25 d-flex flex-column gap-3   rounded-3 "
            style={{ background: "transparent", color: "#606770" }}
          >
            <div className="w-50 align-self-end  ">
              <div className=" rounded-bottom-3 d-flex flex-column  "></div>
            </div>
            <div
              className="w-100 d-flex align-items-center "
              style={{ lineHeight: "10px" }}
            >
              <div className="w-50">
                <p className="fw-bold fs-5  text-dark  ">Total Amount:</p>
              </div>
              <div className="w-50 d-flex flex-column  align-items-end  justify-content-end ">
                <p className=" fs-5 fw-bold text-dark  ">₹ {Total}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p
            className="mb-1 fw-bold "
            style={{ fontSize: "10px", color: "#606770" }}
          >
            Apply discount(%) to all items?
          </p>
          <input
            type="number"
            name="discountRate"
            value={formData.discountRate}
            onChange={(e) => editField(e.target.name, e.target.value)}
            className="form-control border border-2 bg-white border-success "
            style={{ width: "100px" }}
          />
        </>
      )}
    </div>
  );
}
