import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { createOrder } from "@/store/shop/order-slice";
import {
  ArrowLeft,
  Home,
  Minus,
  Plus,
  ShoppingCart,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ShoppingCartPage = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const totalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0,
        )
      : 0;

  const handleInitiateStripePayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Please add items to cart");
      return;
    }

    if (currentSelectedAddress === null) {
      toast.error("Please select one address to proceed!");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        postalCode: currentSelectedAddress?.postalCode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "Pending",
      paymentMethod: "Stripe",
      paymentStatus: "Pending",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
    };

    dispatch(createOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        navigate("/shop/payment", {
          state: {
            orderId: data.payload.orderId,
            clientSecret: data.payload.clientSecret,
          },
        });
      } else {
        toast.error("Failed to initiate payment");
      }
    });
  };

  return (
    <div className="pb-10">
      <div className="px-6 xl:px-30 py-14 bg-[#d1ede4] mb-10">
        <h2 className="font-bold text-2xl mb-2">Shopping Cart</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 px-6 xl:px-30">
        {/* cart items table section */}
        <div className="lg:col-span-2 2xl:col-span-3">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            <div className="rounded-md overflow-hidden border-0">
              <Table className="border-b border-gray-300">
                <TableHeader className="[&_tr]:border-0">
                  <TableRow className="bg-[#00684a] hover:bg-[#00684a]">
                    <TableHead></TableHead>
                    <TableHead className="text-white">Product</TableHead>
                    <TableHead className="text-white">Unit Price</TableHead>
                    <TableHead className="text-white">Quantity</TableHead>
                    <TableHead className="rounded-br-md text-white">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cartItems.items.map((item) => (
                    <TableRow key={item.productId} className="border-gray-300">
                      <TableCell>
                        <X
                          onClick={() => handleCartItemDelete(item)}
                          className="size-5 cursor-pointer ml-2"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="mr-12">{item.title}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        Tk {item.salePrice > 0 ? item.salePrice : item.price}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleUpdateQuantity(item, "minus")}
                            variant="outline"
                            size="icon"
                            disabled={item?.quantity === 1}
                            className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full"
                          >
                            <Minus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <span>{item?.quantity}</span>
                          <Button
                            onClick={() => handleUpdateQuantity(item, "plus")}
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full"
                          >
                            <Plus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        Tk{" "}
                        {(item.salePrice > 0 ? item.salePrice : item.price) *
                          item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-[#d1ede4] p-4 mb-4 rounded-full">
                <ShoppingCart className="size-8 text-[#00684a]" />
              </div>
              <h4 className="font-bold mb-2">Your Cart is Empty!</h4>
              <span className="text-sm text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
              </span>
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={() => navigate("/shop/listing")}
              className="bg-[#00684a] hover:bg-[#00593f]"
            >
              <ArrowLeft />
              Continue Shopping
            </Button>
          </div>
        </div>
        {/* order summary section */}
        <div className="lg:col-span-1 2xl:col-span-1 border border-gray-300 shadow-md rounded-lg flex flex-col gap-4 p-4 h-fit">
          <h4 className="font-bold text-sm">Order Summary</h4>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Items</p>
              <p>{cartItems?.items?.length}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Subtotal</p>
              <p>Tk {totalAmount}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Shipping</p>
              <p>Calculated at checkout</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm font-bold">
            <p>Total</p>
            <p>Tk {totalAmount}</p>
          </div>
          <Button
            onClick={() => navigate("/shop/checkout")}
            className="bg-[#00684a] hover:bg-[#00593f]"
            disabled={cartItems?.items?.length < 1}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
