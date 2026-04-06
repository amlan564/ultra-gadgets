// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Button } from "../ui/button";
// import { Dialog } from "../ui/dialog";
// import AdminOrderDetailsView from "./order-details";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersForAdmin,
//   getOrderDetailsForAdmin,
//   resetOrderDetails,
// } from "@/store/admin/order-slice";
// import { Badge } from "../ui/badge";

// const AdminOrdersView = () => {
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
//   const dispatch = useDispatch();

//   const handleFetchOrderDetails = (getId) => {
//     dispatch(getOrderDetailsForAdmin(getId));
//   };

//   useEffect(() => {
//     setLoading(true);
//     dispatch(getAllOrdersForAdmin()).then(() => {
//       setLoading(false);
//     });
//   }, [dispatch]);

//   useEffect(() => {
//     if (orderDetails !== null) {
//       setOpenDetailsDialog(true);
//     }
//   }, [orderDetails]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <Card className="border border-gray-200 shadow-sm grid grid-cols-1">
//       <CardHeader>
//         <CardTitle>All Orders</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order ID</TableHead>
//                 <TableHead>Order Date</TableHead>
//                 <TableHead>Order Status</TableHead>
//                 <TableHead>Order Price</TableHead>
//                 <TableHead>
//                   <span className="sr-only">Details</span>
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {orderList && orderList.length > 0
//                 ? orderList.map((orderItem, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{orderItem?._id}</TableCell>
//                       <TableCell>
//                         {orderItem?.orderDate.split("T")[0]}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           className={`py-1 px-2 ${
//                             orderItem?.orderStatus === "confirmed"
//                               ? "bg-green-500"
//                               : orderItem?.orderStatus === "rejected"
//                               ? "bg-red-500"
//                               : "bg-black"
//                           }`}
//                         >
//                           {orderItem?.orderStatus}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>{orderItem?.totalAmount}</TableCell>
//                       <TableCell>
//                         <Dialog
//                           open={openDetailsDialog}
//                           onOpenChange={() => {
//                             setOpenDetailsDialog(false);
//                             dispatch(resetOrderDetails());
//                           }}
//                         >
//                           <Button
//                             onClick={() =>
//                               handleFetchOrderDetails(orderItem?._id)
//                             }
//                           >
//                             View Details
//                           </Button>
//                           <AdminOrderDetailsView orderDetails={orderDetails} />
//                         </Dialog>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 : null}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminOrdersView;
