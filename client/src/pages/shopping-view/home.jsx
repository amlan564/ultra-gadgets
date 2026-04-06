import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  Handshake,
  RotateCcw,
  Send,
  Shield,
  Truck,
} from "lucide-react";
import laptopImg from "@/assets/laptop.png";
import monitorImg from "@/assets/monitor.png";
import phoneImg from "@/assets/phone.png";
import cameraImg from "@/assets/camera.png";
import headphoneImg from "@/assets/headphone.png";
import gadgets from "@/assets/gadgets.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  fetchFeaturedProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import toast from "react-hot-toast";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithImage = [
  { id: "laptop", label: "Laptop", image: laptopImg },
  { id: "monitor", label: "Monitor", image: monitorImg },
  { id: "phone", label: "Phone", image: phoneImg },
  { id: "camera", label: "Camera", image: cameraImg },
  { id: "headphone", label: "Headphone", image: headphoneImg },
];

const serviceHighlights = [
  {
    id: "free-delivery",
    title: "Free Delivery",
    description: "On orders Tk 5000+",
    icon: <Truck className="size-14 text-blue-500" />,
  },
  {
    id: "easy-returns",
    title: "Easy Returns",
    description: "7 day policy",
    icon: <RotateCcw className="size-14 text-[#00684a]" />,
  },
  {
    id: "warranty",
    title: "Warranty",
    description: "Official warranty",
    icon: <Shield className="size-14 text-violet-700" />,
  },
  {
    id: "support",
    title: "24/7 Support",
    description: "Always here",
    icon: <Handshake className="size-14 text-orange-700" />,
  },
];

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { productList, featuredProducts } = useSelector(
    (state) => state.shopProducts,
  );

  const { cartItems } = useSelector((state) => state.shopCart);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");

    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId,
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this product`,
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* feature image section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[70vh] xl:h-[85vh] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                key={index}
                src={slide?.image}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-2000`}
              />
            ))
          : null}
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length,
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length,
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* feature products section */}
      <section className="py-12">
        <div className="px-6 xl:px-30">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => navigate("/shop/listing")}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredProducts && featuredProducts.length > 0
              ? featuredProducts.map((productItem, index) => (
                  <ShoppingProductTile
                    key={index}
                    product={productItem}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* shop by category section */}
      <section className="py-12 bg-gray-50">
        <div className="px-6 xl:px-30">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Shop By Category</h2>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => navigate("/shop/listing")}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {categoriesWithImage.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center p-6 max-sm:p-2">
                  <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <img src={categoryItem.image} className="w-full h-full" />
                  </div>
                  <span className="font-semibold">{categoryItem.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* service highlights section */}
      <section className="py-12">
        <div className="px-6 xl:px-30">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {serviceHighlights.map((serviceItem) => (
              <div
                key={serviceItem.id}
                className="bg-gray-200 flex items-center gap-4 p-4 rounded-lg"
              >
                {serviceItem.icon}
                <div>
                  <h2 className="font-bold mb-1">{serviceItem.title}</h2>
                  <h4 className="text-sm text-muted-foreground">
                    {serviceItem.description}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* newsletter section */}
      <section className="py-12">
        <div className="px-6 xl:px-30">
          <div className="bg-[#d1ede4] flex items-center justify-between px-14 py-20 rounded-lg relative">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Get exclusive tech deals
              </h2>
              <h4 className="text-muted-foreground text-sm mb-8">
                Subscribe and get 10% off your first order
              </h4>
              <div className="bg-white flex items-center w-full h-12 rounded-full">
                <Send className="size-7 mx-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full outline-none border-none pr-5"
                />
                <Button className="rounded-full h-full px-10 bg-[#00684a] hover:bg-[#00593f] cursor-pointer">
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="w-110 absolute bottom-0 right-0 rounded-lg overflow-hidden">
              <img src={gadgets} alt="gadgets image" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingHome;
