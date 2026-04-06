import AdminOrderDetailsView from "@/components/admin-view/order-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getAllOrdersForAdmin()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="lg:ml-[260px] mt-[60px]">
      <Card className="border border-gray-200 shadow-sm grid grid-cols-1">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Order Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList && orderList.length > 0
                  ? orderList.map((orderItem, index) => (
                      <TableRow key={index}>
                        <TableCell>{orderItem?._id}</TableCell>
                        <TableCell>
                          {orderItem?.orderDate.split("T")[0]}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-2 ${
                              orderItem?.orderStatus === "Delivered"
                                ? "bg-green-500"
                                : orderItem?.orderStatus === "Rejected"
                                ? "bg-red-500"
                                : "bg-black"
                            }`}
                          >
                            {orderItem?.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{orderItem?.totalAmount}</TableCell>
                        <TableCell>
                          <Dialog
                            open={openDetailsDialog}
                            onOpenChange={() => {
                              setOpenDetailsDialog(false);
                              dispatch(resetOrderDetails());
                            }}
                          >
                            <Button
                              onClick={() =>
                                handleFetchOrderDetails(orderItem?._id)
                              }
                            >
                              View Details
                            </Button>
                            <AdminOrderDetailsView
                              orderDetails={orderDetails}
                            />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
