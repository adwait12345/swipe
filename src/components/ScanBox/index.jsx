import React, { useEffect } from "react";
import { Select } from "antd";
import { HiPlusCircle } from "react-icons/hi2";
const SCBox = ({
  placeholder,
  data,
  localdata,
  setlocaldata,
  newEventName,
  state,
  setState,
  keyname,
  submitted,
}) => {
  useEffect(() => {}, [submitted, state.open, data.product, data]);

  return (
    <Select
      showSearch
      allowClear
      dropdownRender={(menu) => (
        <div>
          <p
            onClick={(ep) => {
              console.log(ep.target.innerText);
              if (keyname) {
                if (keyname === "product") {
                  setlocaldata({
                    ...localdata,
                    [keyname]: ep.target.innerText,
                    id: data.filter((e) => e.name === ep.target.innerText)[0]
                      ?.id,
                    price: data.filter((e) => e.name === ep.target.innerText)[0]
                      ?.price,
                  });
                } else if (keyname !== "product") {
                  setlocaldata({
                    ...localdata,
                    [keyname]: ep.target.innerText,
                  });
                } else if (keyname === "group") {
                  setlocaldata({
                    ...localdata,
                    [keyname]: ep.target.innerText,
                  });
                }
              }
            }}
          >
            {" "}
            {menu}
          </p>

          <div
            onClick={() => {
              setState({ open: true, type: "create" });
            }}
            className=" w-full bg-body-secondary px-3 d-flex align-items-center fw-medium gap-1 fs-6 "
            style={{ cursor: "pointer", height: "40px" }}
          >
            <div className="">
              <HiPlusCircle /> {newEventName}{" "}
            </div>
          </div>
        </div>
      )}
      style={{
        width: "100%",
        height: "35px",
        zIndex: "0",
      }}
      placeholder={placeholder}
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? "").includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={data.map((item) => {
        return { label: item.name, value: item.id };
      })}
    />
  );
};
export default SCBox;
