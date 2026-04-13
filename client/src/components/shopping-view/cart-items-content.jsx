import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "react-hot-toast";

const UserCartItemsContent = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const handleUpdateQuantity = (getCartItem, typeofAction) => {
    if (typeofAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId,
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId,
        );

        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;

          if (getQuantity + 1 > getTotalStock) {
            toast.error(
              `Only ${getQuantity} quantity can be added for this product`,
            );
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeofAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item is updated");
      }
    });
  };

  const handleCartItemDelete = (getCartItem) => {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item is deleted");
      }
    });
  };

  return (
    <div className="flex px-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-16 h-16 max-sm:w-14 max-sm:h-14 object-cover mr-2"
      />
      <div className="flex-1 mr-2">
        <h3 className="font-bold text-xs sm:text-sm">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            variant="outline"
            size="icon"
            disabled={cartItem?.quantity === 1}
            className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full"
          >
            <Minus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span>{cartItem?.quantity}</span>
          <Button
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            variant="outline"
            size="icon"
            className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full"
          >
            <Plus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="font-semibold text-sm max-sm:text-xs">
          Tk{" "}
          {(cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 text-red-500 hover:text-red-600 transition-colors duration-300"
          size={20}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;
