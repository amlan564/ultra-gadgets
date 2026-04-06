import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";

const ShoppingProductTile = ({
  product,
  handleAddToCart,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm mx-auto p-0 pb-4 border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative">
        <div className="group cursor-pointer">
          <img
            src={product?.images[0]}
            alt={product?.title}
            onClick={() => navigate(`/shop/product/${product?._id}`)}
            className="w-full object-cover rounded-t-lg scale-80 group-hover:scale-100 transition duration-500"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-0 left-0 rounded-none rounded-br-xl py-1 bg-black/50 text-white">
              Out of Stock
            </Badge>
          ) : product?.totalStock <= 10 ? (
            <Badge className="absolute top-0 left-0 rounded-none rounded-br-xl py-1 bg-red-500 text-white">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-0 left-0 rounded-none rounded-br-xl py-1 bg-orange-500 text-white">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="px-4 pt-2">
          <h2
            onClick={() => navigate(`/shop/product/${product?._id}`)}
            className="font-semibold mb-2 line-clamp-1 cursor-pointer"
          >
            {product?.title}
          </h2>
          <div className="flex items-center gap-2 mb-4 text-[#00684a] font-bold text-lg">
            {product?.salePrice > 0 ? (
              <span>Tk {[product?.salePrice]}</span>
            ) : null}
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-gray-500 text-sm"
                  : ""
              }`}
            >
              Tk {product?.price}
            </span>
          </div>
          {product?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out of Stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddToCart(product?._id, product?.totalStock)}
              className="w-full bg-[#00684a] hover:bg-[#00593f]"
            >
              Add to Cart
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default ShoppingProductTile;
