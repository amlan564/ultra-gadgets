import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import toast from "react-hot-toast";

const initialFormData = {
  status: "",
};

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message);
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[500px] md:max-w-[600px] h-[90vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-1">
          <div className="flex items-center justify-between mt-6">
            <p className="font-medium">Order ID</p>
            <p className="text-sm">{orderDetails?._id}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Date</p>
            <p className="text-sm">{orderDetails?.orderDate.split("T")[0]}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price</p>
            <p className="text-sm">{orderDetails?.totalAmount}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Method</p>
            <p className="text-sm">{orderDetails?.paymentMethod}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Status</p>
            <p className="text-sm">{orderDetails?.paymentStatus}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-2 ${
                  orderDetails?.orderStatus === "Delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "Rejected"
                    ? "bg-red-500"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="grid grid-cols-[2fr_1fr_auto]">
                      <p>
                        <span className="font-medium">Name: </span>
                        {item.title}
                      </p>
                      <p>
                        <span className="font-medium">Quantity: </span>
                        {item.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Price: </span>
                        {item.price}
                      </p>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-1">
              <p>
                <span className="font-medium">Name: </span>
                {user?.fullName}
              </p>
              <p>
                <span className="font-medium">Address: </span>
                {orderDetails?.addressInfo?.address}
              </p>
              <p>
                <span className="font-medium">City: </span>
                {orderDetails?.addressInfo?.city}
              </p>
              <p>
                <span className="font-medium">Postal Code: </span>
                {orderDetails?.addressInfo?.postalCode}
              </p>
              <p>
                <span className="font-medium">Phone: </span>
                {orderDetails?.addressInfo?.phone}
              </p>
            </div>
          </div>
        </div>
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
                placeholder: "Select Order Status",
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleUpdateStatus}
            isBtnDisabled={!formData.status}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;
