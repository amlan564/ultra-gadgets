import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  addAddress,
  deleteAddress,
  fetchAllAddress,
  updateAddress,
} from "@/store/shop/address-slice";
import { createOrder } from "@/store/shop/order-slice";
import {
  Check,
  CreditCard,
  Home,
  Pencil,
  Plus,
  Tag,
  Trash2,
  Truck,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Standard Delivery",
    price: 60,
    description: "Delivered in 3–5 days",
    Icon: Truck,
  },
  {
    id: "express",
    label: "Express Delivery",
    price: 100,
    description: "Delivered in 1-2 days",
    Icon: Zap,
  },
];

const PROMO_CODES = {
  SAVE500: 500,
  SAVE200: 200,
};

const SectionCard = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-5">
      <h3 className="font-semibold text-base text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const ShoppingCheckoutPage = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [currentUpdatedId, setCurrentUpdatedId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    if (user?.id) dispatch(fetchAllAddress(user?.id));
  }, [dispatch, user?.id]);

  const shippingCost =
    SHIPPING_OPTIONS.find((o) => o.id === selectedShipping)?.price || 0;

  const subtotal =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0,
        )
      : 0;

  const totalAmount = subtotal + shippingCost - promoDiscount;
  const currentStep = !selectedAddress ? 1 : !selectedShipping ? 2 : 3;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoDiscount(PROMO_CODES[code]);
      toast.success(`Promo applied! Tk ${PROMO_CODES[code]} off`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
  };

  const isAddressFormValid = () =>
    Object.values(newAddress).every((v) => v.trim() !== "");

  const handleManageAddress = () => {
    if (addressList?.length >= 3 && currentUpdatedId === null) {
      toast.error("You can add maximum 3 addresses");
      setNewAddress({ address: "", city: "", postalCode: "", phone: "" });
      return;
    }

    if (user?.role === "guest") {
      toast.error("Guest users cannot add address");
      return;
    }

    if (currentUpdatedId !== null) {
      dispatch(
        updateAddress({
          userId: user?.id,
          addressId: currentUpdatedId,
          formData: newAddress,
        }),
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          setCurrentUpdatedId(null);
          setNewAddress({ address: "", city: "", postalCode: "", phone: "" });
          setShowAddressForm(false);
          toast.success("Address updated successfully");
        }
      });
    } else {
      dispatch(addAddress({ ...newAddress, userId: user?.id })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          setNewAddress({ address: "", city: "", postalCode: "", phone: "" });
          setShowAddressForm(false);
          toast.success("Address added successfully");
        }
      });
    }
  };

  const handleEditAddress = (addr) => {
    setCurrentUpdatedId(addr._id);
    setNewAddress({
      address: addr.address,
      city: addr.city,
      phone: addr.phone,
      postalCode: addr.postalCode,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addr) => {
    dispatch(deleteAddress({ userId: user?.id, addressId: addr._id })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          if (selectedAddress?._id === addr._id) setSelectedAddress(null);
          toast.success("Address deleted successfully");
        }
      },
    );
  };

  const buildOrderData = (paymentMethod) => ({
    userId: user?.id,
    fullName: user?.fullName,
    cartId: cartItems?._id,
    cartItems: cartItems.items.map((item) => ({
      productId: item?.productId,
      title: item?.title,
      image: item?.image,
      price: item?.salePrice > 0 ? item?.salePrice : item?.price,
      quantity: item?.quantity,
    })),
    addressInfo: {
      addressId: selectedAddress?._id,
      address: selectedAddress?.address,
      city: selectedAddress?.city,
      postalCode: selectedAddress?.postalCode,
      phone: selectedAddress?.phone,
    },
    orderStatus: "Pending",
    paymentMethod,
    paymentStatus: "Pending",
    totalAmount,
    shippingMethod: selectedShipping,
    shippingCost,
    promoCode: appliedPromo,
    promoDiscount,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentId: "",
  });

  const validate = () => {
    if (!cartItems?.items?.length) {
      toast.error("Your cart is empty.");
      return false;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    if (selectedPayment === "stripe") {
      dispatch(createOrder(buildOrderData("Stripe"))).then((data) => {
        if (data?.payload?.success) {
          navigate("/shop/payment", {
            state: {
              orderId: data.payload.orderId,
              clientSecret: data.payload.clientSecret,
            },
          });
        } else {
          toast.error("Failed to initiate payment.");
        }
      });
    } else {
      dispatch(createOrder(buildOrderData("COD"))).then((data) => {
        if (data?.payload?.success) {
          toast.success("Order placed successfully!");
          navigate("/shop/order-placed", {
            state: { orderId: data.payload.orderId },
          });
        } else {
          toast.error("Failed to place order.");
        }
      });
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="px-6 xl:px-30 py-14 bg-[#d1ede4] mb-10">
        <h2 className="font-bold text-2xl mb-2">Checkout</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop/cart">Shopping Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 px-6 xl:px-30">
        {/* Left — delivery address, delivert method and payment method section */}
        <div className="lg:col-span-2 2xl:col-span-3 flex flex-col gap-5">
          {/* Delivery Address */}
          <SectionCard title="Delivery Address">
            {addressList?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                {addressList.map((addr) => {
                  const isSelected = selectedAddress?._id === addr._id;

                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#00684a] bg-[#d1ede4]"
                          : "border-gray-200 hover:border-[#00684a] bg-white"
                      }`}
                    >
                      <div
                        className={`absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected
                            ? "bg-[#00684a]"
                            : "border-2 border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>

                      {/* Edit / Delete */}
                      <div className="absolute top-2.5 right-2.5 flex gap-1">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(addr);
                          }}
                          className="p-1 text-gray-400 hover:text-[#00684a] cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="pl-7 pr-10">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {addr.city}
                        </p>
                        <p className="text-xs text-gray-500">{addr.phone}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {addr.address}, {addr.city} {addr.postalCode}
                        </p>
                        <p className="text-xs text-gray-500"></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Address */}
            {!showAddressForm ? (
              <Button
                onClick={() => setShowAddressForm(true)}
                className="w-full border border-dashed border-gray-300 bg-white rounded text-gray-600 hover:border-[#00684a] hover:text-[#00684a] hover:bg-[#d1ede4] transition-all cursor-pointer"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </Button>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUpdatedId !== null
                      ? "Update Address"
                      : "Add New Address"}
                  </p>
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setCurrentUpdatedId(null);
                      setNewAddress({
                        address: "",
                        city: "",
                        postalCode: "",
                        phone: "",
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-gray-500 mb-1 block">
                      Address
                    </Label>
                    <Input
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">
                      City
                    </Label>
                    <Input
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">
                      Postal Code
                    </Label>
                    <Input
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-gray-500 mb-1 block">
                      Phone
                    </Label>
                    <Input
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleManageAddress}
                    disabled={!isAddressFormValid()}
                    className="bg-[#00684a] hover:bg-[#00593f] text-white text-sm"
                  >
                    {currentUpdatedId !== null ? "Update" : "Save Address"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddressForm(false);
                      setCurrentUpdatedId(null);
                      setNewAddress({
                        address: "",
                        city: "",
                        postalCode: "",
                        phone: "",
                      });
                    }}
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </SectionCard>
          {/* Shipping */}
          <SectionCard title="Delivery Method">
            <div className="flex flex-col gap-3">
              {SHIPPING_OPTIONS.map(
                ({ id, label, price, description, Icon }) => {
                  const isSelected = selectedShipping === id;
                  return (
                    <Button
                      key={id}
                      onClick={() => setSelectedShipping(id)}
                      className={`w-full flex items-center gap-4 px-4 py-8 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-[#00684a] bg-[#d1ede4] hover:bg-[#d1ede4]"
                          : "border-gray-200 hover:border-[#00684a] bg-white hover:bg-white"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-[#00684a] text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <p
                        className={`text-sm font-bold flex-shrink-0 ${
                          isSelected ? "text-[#00684a]" : "text-gray-700"
                        }`}
                      >
                        Tk {price}
                      </p>
                    </Button>
                  );
                },
              )}
            </div>
          </SectionCard>
          {/* Payment */}
          <SectionCard title="Payment Method">
            <div className="flex flex-col gap-3">
              {/* Stripe */}
              <Button
                onClick={() => setSelectedPayment("stripe")}
                className={`w-full flex items-center gap-4 px-4 py-8 rounded-xl border text-left transition-all ${
                  selectedPayment === "stripe"
                    ? "border-[#00684a] bg-[#d1ede4] hover:bg-[#d1ede4]"
                    : "border-gray-200 hover:border-[#00684a] bg-white hover:bg-white"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">
                      Credit/Debit Card
                    </p>
                    <span className="text-xs font-medium text-[#00684a]">
                      (Stripe)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {["VISA", "MC", "AMEX"].map((b) => (
                      <span
                        key={b}
                        className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </Button>

              {/* COD */}
              <Button
                onClick={() => setSelectedPayment("cod")}
                className={`w-full flex items-center gap-4 px-4 py-8 rounded-xl border text-left transition-all ${
                  selectedPayment === "cod"
                    ? "border-[#00684a] bg-[#d1ede4] hover:bg-[#d1ede4]"
                    : "border-gray-200 hover:border-[#00684a] bg-white hover:bg-white"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#00684a] flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <span className="text-xs font-medium text-gray-500">
                      (COD)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay with cash upon delivery
                  </p>
                </div>
              </Button>
            </div>
          </SectionCard>
        </div>
        {/* Right — Order Summary section */}
        <div className="lg:col-span-1 2xl:col-span-1 h-fit">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold text-base mb-4">Order Summary</h4>
            <Separator />
            {/* Items */}
            <div className="flex flex-col gap-3 my-4 max-h-52 overflow-y-auto">
              {cartItems?.items?.map((item) => (
                <div className="flex items-start">
                  <div
                    key={item.productId}
                    className="flex items-start flex-1 gap-3 pr-2"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-xs">{item.title}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs shrink-0">
                    Tk{" "}
                    {(item.salePrice > 0 ? item.salePrice : item.price) *
                      item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <Separator />
            {/* promo code */}
            <div className="mt-4">
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-8 text-sm h-9"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromo}
                    className="bg-[#00684a] hover:bg-[#00593f] text-white h-9 px-4 text-sm"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#d1ede4] border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#00684a] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#00684a]">
                      {appliedPromo}
                    </span>
                    <span className="text-xs text-[#00684a]">
                      · Tk {promoDiscount} off
                    </span>
                  </div>
                  <button onClick={handleRemovePromo}>
                    <X className="w-4 h-4 text-[#00684a] hover:text-[#00593f] cursor-pointer" />
                  </button>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            {/* Full breakdown */}
            <div className="flex flex-col gap-1.5 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal ({cartItems?.items?.length || 0} items)
                </span>
                <span>Tk {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>Tk {shippingCost}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-[#00684a]">
                    −Tk {promoDiscount}
                  </span>
                </div>
              )}
            </div>
            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                Tk {totalAmount}
              </span>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={!cartItems?.items?.length || user?.role === "guest"}
              className="w-full mt-4 bg-[#00684a] hover:bg-[#00593f] text-white font-semibold transition"
              size="lg"
            >
              {selectedPayment === "stripe"
                ? `Pay Tk ${totalAmount}`
                : `Place Order`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckoutPage;
