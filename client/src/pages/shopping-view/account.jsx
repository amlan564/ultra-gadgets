import ShoppingOrders from "@/components/shopping-view/orders";
import Profile from "@/components/shopping-view/profile";
import UserCard from "@/components/shopping-view/user-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ShoppingAccount = () => {
  const { user } = useSelector((state) => state.auth);

  const [activeTabs, setActiveTabs] = useState(0);

  if (user.fullName === "Guest") {
    toast.error("Guest users cannot access this page.");
    return <Navigate to="/shop/home" replace />;
  }

  return (
    <div className="flex flex-col mx-6 xl:mx-30">
      <div className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-2">
            <UserCard />
            <div className="flex lg:flex-col lg:items-start mt-4 lg:rounded-lg">
              <Button
                className={`shadow-sm transition rounded-none lg:rounded-t-lg w-24 md:w-28 lg:w-full ${
                  activeTabs === 0
                    ? "bg-[#00684a] text-white hover:bg-[#00684a]"
                    : "bg-gray-50 text-black hover:bg-[#d1ede4] hover:text-black"
                }`}
                onClick={() => setActiveTabs(0)}
              >
                Orders
              </Button>
              <Button
                className={`shadow-sm transition rounded-none lg:rounded-b-lg w-24 md:w-28 lg:w-full ${
                  activeTabs === 1
                    ? "bg-[#00684a] text-white hover:bg-[#00684a]"
                    : "bg-gray-50 text-black hover:bg-[#d1ede4] hover:text-black"
                }`}
                onClick={() => setActiveTabs(1)}
              >
                Profile
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            {activeTabs === 0 && <ShoppingOrders />}
            {activeTabs === 1 && <Profile />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
