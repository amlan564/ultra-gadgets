import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

const ShoppingLayout = () => {
  return (
    <div className="flex flex-col overflow-hidden bg-gray-50">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full mt-16">
        <Outlet />
      </main>
      <ShoppingFooter />
    </div>
  );
};

export default ShoppingLayout;
