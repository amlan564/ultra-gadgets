import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { ShoppingBag, ShoppingCart } from "lucide-react";

const UserCartWrapper = ({ setOpenCartSheet, cartItems }) => {
  const navigate = useNavigate();

  const totalAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0,
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md h-screen overflow-y-auto flex flex-col justify-between border-none">
      <SheetHeader className="px-0">
        <div className="flex items-center gap-2 px-4 pb-2">
          <ShoppingCart className="size-5" />
          <SheetTitle className="text-sm font-bold">
            Shopping Cart <span>({cartItems?.length})</span>
          </SheetTitle>
        </div>
        <Separator className="" />
      </SheetHeader>
      {/* cart items section */}
      <div className="space-y-4 h-screen overflow-y-auto">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="bg-[#d1ede4] p-4 mb-4 rounded-full">
              <ShoppingCart className="size-8 text-[#00684a]" />
            </div>
            <h4 className="font-bold mb-2">Your Cart is Empty!</h4>
            <span className="text-sm text-center text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="mt-4 px-4">
          <Separator />
        </div>
        <div className="px-4 py-4">
          <div className="flex justify-between">
            <span className="font-bold">Subtotal</span>
            <span className="font-bold">Tk {totalAmount}</span>
          </div>
        </div>
        <div className="px-4 pb-5">
          <Button
            onClick={() => {
              navigate("/shop/cart");
              setOpenCartSheet(false);
            }}
            className="w-full bg-[#00684a] hover:bg-[#00593f]"
          >
            View Cart
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
