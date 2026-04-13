import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderPlaced = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 xl:px-30">
      <CircleCheckBig className="text-[#00684a] size-12" />
      <h1 className="text-2xl sm:text-3xl font-bold my-4 text-center">
        Order Confirmed!
      </h1>
      <h4 className="text-center">Thank you! Your orders has been successfully placed.</h4>
      <div className="flex items-center gap-4 mt-8">
        <Button
          onClick={() => navigate("/shop/account")}
          variant="outline"
        >
          View Orders
        </Button>
        <Button
          onClick={() => navigate("/shop/listing")}
          className="bg-[#00684a] hover:bg-[#00593f]"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderPlaced;
