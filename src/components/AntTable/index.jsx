import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { RiDeleteBinFill } from "react-icons/ri";
import Footer from "./footer";
import { useDispatch } from "react-redux";
import { updateGroup } from "../../redux/groupSlice";

const Ant_Table = ({
  formData,
  editField,
  Products,
  setFormData,
  enableGrouping,
  Groups,
  groups,
  group,
  index,
  setGroups,
  groupformData,
  setGroupformData,
  handleCalculateTotal_for_group,
}) => {
  const [combined, setCombined] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    let data;

    if (!enableGrouping) {
      data = Products.filter((item) => {
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
      setCombined([...data]);
    } else if (enableGrouping) {
      data = Products.filter((item) => {
        return group.productIds.some((prod) => prod.prodId === item.id);
      }).map((product) => ({
        ...product,
        // Merge the quantity from the group into the product data
        quantity:
          group.productIds.find((prod) => prod.prodId === product.id)
            ?.quantity || 0,
        netAmount:
          group.productIds.find((prod) => prod.prodId === product.id)
            ?.quantity * product.price || 0,
      }));
      setCombined([...data]);
    }
  }, [group?.productIds, formData]);


  const handleRowDel = (itemToDelete) => {
    if (!enableGrouping) {
      const updatedItems = formData.items.filter((item) => {
        return item.prodId.toString() !== itemToDelete;
      });

      setFormData({ ...formData, items: updatedItems });
    } else if (enableGrouping) {
      const updatedItems = group.productIds.filter((item) => {
        return item.prodId.toString() !== itemToDelete;
      });
      group.productIds = updatedItems;


      let groupID = Groups.filter((e) => group.name === e.name)[0].id;

      dispatch(
        updateGroup({
          id: groupID,
          updatedGroup: {
            ...Groups.filter((e) => e.name === group.name)[0],
            productIds: updatedItems,
          },
        })
      );
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text, record) => {
        return (
          <div className="d-flex flex-column ">
            <p className="fw-medium m-0">{text}</p>
            <span
              style={{
                fontSize: "10px",
                padding: "0",
                margin: "0",
                color: "#606770",
              }}
            >
              #{record.id}
            </span>
          </div>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "25%",

      render: (text) => {
        return (
          <div className="input-group w-75">
            <input
              type="number"
              className="form-control border bg-white"
              value={text}
              aria-describedby="basic-addon2"
            />
            <span
              className="input-group-text fw-medium bg-white "
              style={{ color: "#606770" }}
              id="basic-addon2"
            >
              OTH
            </span>
          </div>
        );
      },
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (text) => {
        return (
          <div className="input-group w-75 ">
            <input
              type="number"
              className="form-control border bg-white"
              value={text}
              aria-describedby="basic-addon2"
            />
          </div>
        );
      },
    },
    {
      title: "Discount (Total Amount)",
      key: "tags",
      dataIndex: "tags",
      width: "15%",
      render: () => {
        return (
          <div className="input-group ">
            <input
              type="number"
              className="form-control border bg-white"
              defaultValue={0}
              aria-describedby="basic-addon2"
            />
            <span
              className="input-group-text fw-medium bg-white "
              id="basic-addon2"
            >
              %
            </span>
          </div>
        );
      },
    },
    {
      title: "Net Amount",
      key: "netAmount",
      dataIndex: "netAmount",
      align: "right",
      width: "10%",

      render: (text) => <p>{text}</p>,
    },
    {
      title: "",
      key: "action",
      width: "5%",
      render: (record) => (
        <p
          onClick={() => {
            handleRowDel(record.id.toString().trim());
          }}
          className="py-2  rounded d-flex align-items-center justify-content-center   "
          style={{
            background: "#FEF0F4",
            fontWeight: "bold",
            color: "red",
            cursor: "pointer",
          }}
        >
          <RiDeleteBinFill />
        </p>
      ),
    },
  ];

  return (
    <Table
      className=""
      style={{}}
      pagination={false}
      columns={columns}
      dataSource={combined}
      footer={() => (
        <Footer
          formData={formData}
          editField={editField}
          Groups={Groups}
          groups={groups}
          setGroups={setGroups}
          index={index}
          group={group}
          enableGrouping={enableGrouping}
          combined={combined}
          groupformData={groupformData}
          handleCalculateTotal_for_group={handleCalculateTotal_for_group}
          setGroupformData={setGroupformData}
        />
      )}
    />
  );
};
export default Ant_Table;
