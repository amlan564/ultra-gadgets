import { Button } from "@/components/ui/button";
import { capturePayment } from "@/store/shop/order-slice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({
  orderId,
  setIsPaymentStart,
  dispatch,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/order-placed`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setIsPaymentStart(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      dispatch(capturePayment({ orderId, paymentId: paymentIntent.id })).then(
        (data) => {
          if (data?.payload?.success) {
            toast.success("Payment completed successfully");
            navigate("/shop/order-placed");
          } else {
            toast.error("Payment failed. Please try again.");
          }
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || !elements}
        className="w-full mt-4 bg-[#00684a] hover:bg-[#00593f]"
      >
        Pay with Stripe
      </Button>
    </form>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const { orderId, clientSecret } = state || {};
  const dispatch = useDispatch();

  if (!orderId || !clientSecret) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <p className="text-red-500">Error: Invalid payment details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-center mb-6">
        Complete Your Payment
      </h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          orderId={orderId}
          clientSecret={clientSecret}
          dispatch={dispatch}
        />
      </Elements>
    </div>
  );
};

export default Payment;
