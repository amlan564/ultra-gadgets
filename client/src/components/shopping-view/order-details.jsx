import React from "react";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const getOrderStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "In Process":
      return "bg-blue-100 text-blue-800";
    case "In Shipping":
      return "bg-purple-100 text-purple-800";
    case "Delivered":
      return "bg-[#d1ede4] text-[#00684a]";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[500px] md:max-w-[600px] h-[90vh] overflow-y-auto border-none">
      <div className="flex flex-col gap-4">
        {/* order summary section */}
        <div className="flex flex-col gap-4">
          <div className="font-bold">Order Summary</div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium">Order ID</p>
              <p>{orderDetails?._id}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Order Date</p>
              <p>{orderDetails?.orderDate.split("T")[0]}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Order Price</p>
              <p>{orderDetails?.totalAmount}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Payment Method</p>
              <p>{orderDetails?.paymentMethod}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Payment Status</p>
              <p>{orderDetails?.paymentStatus}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Order Status</p>
              <p>
                <Badge
                  className={`py-1 px-2 ${getOrderStatusStyle(
                    orderDetails?.orderStatus,
                  )}`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </p>
            </div>
          </div>
        </div>
        <Separator />
        {/* order items section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-bold">Order Items</div>
            <ul className="flex flex-col gap-3 text-sm">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <div className="flex items-start">
                      <div
                        key={item.productId}
                        className="flex items-start flex-1 gap-3 pr-2"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-sm">{item.title}</p>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm shrink-0">
                        Tk{" "}
                        {(item.salePrice > 0 ? item.salePrice : item.price) *
                          item.quantity}
                      </p>
                    </div>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <Separator />
        {/* shipping info section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-bold">Shipping Info</div>
            <div className="flex flex-col gap-2 text-sm">
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
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetailsView;
