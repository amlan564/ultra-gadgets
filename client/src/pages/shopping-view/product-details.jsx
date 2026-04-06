import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Heart, Home, Minus, Plus, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { addReview, getReviews } from "@/store/shop/review-slice";
import StarRating from "@/components/common/star-rating";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import {
  addToCart,
  fetchCartItems,
  updateCartQuantity,
} from "@/store/shop/cart-slice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RelatedProducts from "@/components/shopping-view/related-products";

const ShoppingProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const [selectedImage, setSelectedImage] = useState(productDetails?.images[0]);
  const [activeTabs, setActiveTabs] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const currentCartItem = cartItems?.items?.find(
    (item) => item.productId === id,
  );

  const totalStock = productDetails?.totalStock || 0;

  const [localQuantity, setLocalQuantity] = useState(
    currentCartItem?.quantity || 1,
  );

  useEffect(() => {
    setLocalQuantity(currentCartItem?.quantity || 1);
  }, [currentCartItem]);

  const handleLocalQuantity = (typeofAction) => {
    if (typeofAction === "plus" && localQuantity < totalStock) {
      setLocalQuantity(localQuantity + 1);
    } else if (typeofAction === "minus" && localQuantity > 1) {
      setLocalQuantity(localQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (currentCartItem) {
      dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: productDetails?._id,
          quantity: localQuantity,
        }),
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Cart item updated");
        }
      });
    } else {
      dispatch(
        addToCart({
          userId: user?.id,
          productId: productDetails?._id,
          quantity: localQuantity,
        }),
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Product is added to cart");
        }
      });
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);

    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
  };

  const handleChangeRating = (getRating) => {
    setRating(getRating);
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        fullName: user?.fullName,
        reviewMessage: reviewMsg,
        rating: rating,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getReviews(productDetails?._id));
        setRating(0);
        setReviewMsg("");
        toast.success("Review added successfully");
      }
    });
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails?.images.length > 0) {
      setSelectedImage(productDetails?.images[0]);
    }
  }, [productDetails]);

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) /
        reviews.length
      : 0;

  const discount = Math.round(
    ((productDetails?.price - productDetails?.salePrice) /
      productDetails?.price) *
      100,
  );

  return (
    <div className="px-6 xl:px-30 py-10">
      {/* breadcumb */}
      <div className="pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <Home className="size-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/shop/listing?category=${productDetails?.category}`}>
                {productDetails?.category.charAt(0).toUpperCase() + productDetails?.category.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#00684a]">
                {productDetails?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Product Details */}
      <div className="grid grid-cols-7 gap-12 pb-10">
        {/* product image section */}
        <div className="col-span-3 flex gap-4">
          <div className="flex flex-col gap-2">
            {productDetails?.images.map((image, index) => (
              <div
                key={index}
                className={`border-2 w-26 h-26 rounded-lg overflow-hidden cursor-pointer ${
                  selectedImage === image
                    ? "border-[#00684a]"
                    : "border-gray-300 opacity-50"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
          </div>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden w-full h-110">
            <InnerImageZoom
              src={selectedImage}
              zoomType="hover"
              zoomScale={1}
              className="w-full h-full"
            />
          </div>
        </div>
        {/* product details section */}
        <div className="col-span-4">
          <h2 className="text-3xl font-semibold">
            {productDetails?.title}
          </h2>
          {/* product review */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRating rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              {averageReview.toFixed(1)} ({reviews.length}{" "}
              {reviews.length > 1 ? "reviews" : "review"})
            </span>
          </div>
          {/* product price */}
          <div className="flex items-center gap-4 my-4 text-[#00684a] font-bold text-3xl">
            {productDetails?.salePrice > 0 ? (
              <span>Tk {productDetails?.salePrice}</span>
            ) : null}
            <span
              className={`${
                productDetails?.salePrice > 0
                  ? "line-through text-gray-500 text-xl"
                  : ""
              }`}
            >
              Tk {productDetails?.price}
            </span>
          </div>
          <p className="text-gray-600 text-sm text-justify pr-30">
            {productDetails?.description}
          </p>
          <h4 className="mt-6 font-semibold">Select Quantity:</h4>
          <div className="flex items-center gap-4 mt-1">
            <Button
              onClick={() => handleLocalQuantity("minus")}
              variant="outline"
              size="icon"
              disabled={localQuantity <= 1}
              className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full"
            >
              <Minus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span>{localQuantity}</span>
            <Button
              onClick={() => handleLocalQuantity("plus")}
              variant="outline"
              size="icon"
              disabled={localQuantity >= totalStock}
              className="w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-full"
            >
              <Plus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-6">
            {productDetails?.totalStock === 0 ? (
              <Button
                className="opacity-60 cursor-not-allowed"
                size="lg"
              >
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="bg-[#00684a] hover:bg-[#00593f] cursor-pointer transition"
                size="lg"
              >
                <ShoppingCart />
                Add to Cart
              </Button>
            )}
            <Button
              className="border border-gray-300 bg-gray-100 text-black hover:bg-[#00684a] hover:text-white transition"
              size="lg"
            >
              <Heart />
            </Button>
          </div>
        </div>
      </div>
      {/* product description and reviews section */}
      <div className="border-2 border-gray-300 rounded-lg p-10">
        <div className="flex items-center gap-10">
          <Button
            className={`shadow-sm transition ${
              activeTabs === 0
                ? "bg-[#00684a] text-white hover:bg-[#00684a]"
                : "bg-gray-50 text-black hover:bg-[#00684a] hover:text-white"
            }`}
            onClick={() => setActiveTabs(0)}
          >
            Description
          </Button>
          <Button
            className={`shadow-sm transition ${
              activeTabs === 1
                ? "bg-[#00684a] text-white hover:bg-[#00684a]"
                : "bg-gray-50 text-black hover:bg-[#00684a] hover:text-white"
            }`}
            onClick={() => setActiveTabs(1)}
          >
            Reviews ({reviews.length})
          </Button>
        </div>

        {activeTabs === 0 && (
          <div className="pt-10">{productDetails?.description}</div>
        )}
        {activeTabs === 1 && (
          <div className="pt-10 grid grid-cols-5 gap-12">
            {/* customer reviews section */}
            <div className="col-span-3">
              <h2 className="font-bold text-lg mb-6">Customer Reviews</h2>
              <div className="flex flex-col gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg shadow-sm">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#00684a] text-white">
                          {reviewItem?.fullName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <h3 className="font-bold">
                              {reviewItem?.fullName}
                            </h3>
                            <span className="text-muted-foreground text-sm">
                              {formatTime(reviewItem?.updatedAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRating rating={reviewItem?.rating} />
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">
                          {reviewItem?.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Reviews</h1>
                )}
              </div>
              {/* write a review section */}
              <div className="mt-20 flex flex-col items-start gap-2">
                <Label className="font-bold text-lg mb-2">Write a review</Label>
                <div className="flex gap-1">
                  <StarRating
                    rating={rating}
                    handleChangeRating={handleChangeRating}
                  />
                </div>
                <Textarea
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Write a review..."
                  className="min-h-30 mt-4"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  size="lg"
                  className="mt-2 bg-[#00684a] hover:bg-[#00593f] transition"
                >
                  Submit Review
                </Button>
              </div>
            </div>
            {/* percentage of ratings */}
            <div className="col-span-2">
              <h2 className="font-bold text-lg mb-3">Ratings & Reviews</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">
                  <StarRating rating={averageReview} />
                </div>
                <span className="font-semibold text-sm text-gray-700">
                  {averageReview.toFixed(1)} out of 5
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percent =
                    reviews.length > 0
                      ? Math.round((count / reviews.length) * 100)
                      : 0;

                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-10 shrink-0">
                        {star} star
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-sm h-5 relative overflow-hidden">
                        <div
                          className="bg-[#00684a] h-full rounded-sm transition-all duration-500 flex items-center justify-center"
                          style={{ width: `${percent}%` }}
                        >
                          {percent > 0 && (
                            <span className="text-xs text-white font-medium">
                              {percent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <div>
        <RelatedProducts productId={id} />
      </div> */}
    </div>
  );
};

export default ShoppingProductDetails;
