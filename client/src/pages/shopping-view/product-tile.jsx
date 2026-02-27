import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye } from "lucide-react";
import React from "react";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto p-0 pb-4 border border-gray-200 shadow-sm overflow-hidden cursor-pointer">
      <div className="relative">
        <div className="relative group">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full object-cover rounded-t-lg scale-80 hover:scale-100 transition duration-500"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-black/50 text-white">
              Out of Stock
            </Badge>
          ) : product?.totalStock <= 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="px-4 pt-2">
          <h2 className="font-medium mb-4 line-clamp-1">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2 text-lg font-bold">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-red-500" : ""
              }`}
            >
              Tk {product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span>Tk {[product?.salePrice]}</span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col px-4 gap-2">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to Cart
          </Button>
        )}
        <Button
          className="w-full"
          variant="outline"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          View Product
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
