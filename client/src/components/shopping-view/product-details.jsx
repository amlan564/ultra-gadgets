import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRating from "../common/star-rating";
import { addReview, getReviews } from "@/store/shop/review-slice";

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const handleChangeRating = (getRating) => {
    setRating(getRating);
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
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

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId,
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        console.log(getTotalStock);

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

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.rating, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid max-md:grid-cols-1 max-md:max-h-[600px] max-md:overflow-y-auto grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw] bg-white border-none">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full scale-70"
          />
        </div>
        <div>
          <div>
            <h1 className="text-lg font-medium mb-2">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-sm mb-4 text-justify">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-lg font-bold ${
                productDetails?.salePrice > 0 ? "line-through text-red-500" : ""
              }`}
            >
              Tk {productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-lg font-bold">
                Tk {productDetails?.salePrice}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRating rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(1)})
            </span>
          </div>

          <div className="my-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock,
                  )
                }
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          <div className="max-h-[200px] overflow-auto pr-2">
            <h2 className="text-lg font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRating rating={reviewItem?.rating} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Label className="text-base font-medium">Write a review</Label>
              <div className="flex gap-1">
                <StarRating
                  rating={rating}
                  handleChangeRating={handleChangeRating}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
