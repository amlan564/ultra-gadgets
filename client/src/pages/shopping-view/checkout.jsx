import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { capturePayment, createOrder } from "@/store/shop/order-slice";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// for stripe payment
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with the publishable key from environment variables
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const CheckoutForm = ({
//   orderId,
//   clientSecret,
//   setIsPaymentStart,
//   dispatch,
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     setIsPaymentStart(true);

//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/shop/stripe-return`,
//       },
//       redirect: "if_required",
//     });

//     if (error) {
//       toast.error(error.message);
//       setIsPaymentStart(false);
//     } else if (paymentIntent && paymentIntent.status === "succeeded") {
//       dispatch(capturePayment({ orderId, paymentId: paymentIntent.id })).then(
//         (data) => {
//           if (data?.payload?.success) {
//             setIsPaymentStart(false);
//             toast.success("Payment captured successfully");
//           } else {
//             setIsPaymentStart(false);
//             toast.error("Failed to capture payment");
//           }
//         }
//       );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <Button
//         type="submit"
//         disabled={!stripe || !elements}
//         className="w-full mt-4"
//       >
//         Pay with Stripe
//       </Button>
//     </form>
//   );
// };

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { clientSecret, orderId } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        pincode: currentSelectedAddress?.pincode,
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
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_2fr] gap-5 px-6 xl:px-30 py-8">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-3">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent cartItem={item} />
            ))
          ) : (
            <div className="flex items-center justify-center h-20">
              <p>Your Cart is Empty</p>
            </div>
          )}
          <div className="mt-4 px-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">Tk {totalAmount}</span>
            </div>
          </div>

          <Button onClick={() => navigate("/shop/listing")} className="mt-2">
            Continue Shopping
          </Button>

          <Button
            onClick={handleInitiateStripePayment}
            disabled={cartItems.items?.length === 0 || user.role === "guest"}
            className="w-full bg-green-500 hover:bg-green-600 transition-all"
          >
            Proceed To Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
