import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import Profile from "@/components/shopping-view/profile";
import UserCard from "@/components/shopping-view/user-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { checkAuth } from "@/store/auth-slice";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

const ShoppingAccount = () => {
  // const { user, isAuthenticated, isLoading } = useSelector(
  //   (state) => state.auth
  // );
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   if (token && !isAuthenticated && !isLoading) {
  //     dispatch(checkAuth(JSON.parse(token)));
  //   }
  // }, [dispatch, isAuthenticated, isLoading]);

  const { user } = useSelector((state) => state.auth);

  if (user.userName === "Guest") {
    toast.error("Guest users cannot access this page.");
    return <Navigate to="/shop/home" replace />;
  }

  return (
    <div className="flex flex-col mx-6 xl:mx-30">
      <div className="py-10">
        <div className="flex flex-col">
          <Tabs
            defaultValue="orders"
            className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-4"
          >
            <div className="">
              <UserCard />
              <TabsList className="mt-4 flex lg:flex-col w-2/3 md:w-1/3 lg:w-full bg-white h-auto shadow-sm border border-gray-200">
                <TabsTrigger value="orders" className="cursor-pointer w-full">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="address" className="cursor-pointer w-full">
                  Address
                </TabsTrigger>
                <TabsTrigger value="profile" className="cursor-pointer w-full">
                  Profile
                </TabsTrigger>
              </TabsList>
            </div>
            <div>
              <TabsContent value="orders">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address">
                <Address />
              </TabsContent>
              <TabsContent value="profile">
                <Profile />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
