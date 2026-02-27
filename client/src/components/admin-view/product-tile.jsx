import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

const AdminProductTile = ({
  product,
  setOpenCreateProductsDialog,
  setFormData,
  setCurrentUpdatedId,
  handleDelete,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto p-0 pb-4 border-none shadow-sm overflow-hidden cursor-pointer">
      <div>
        <div className="relative mb-2 group">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full object-cover rounded-t-lg scale-80 hover:scale-100 transition duration-300"
          />
        </div>
        <CardContent>
          <h2 className="font-medium mb-4 line-clamp-1">{product?.title}</h2>
          <div className="flex justify-between items-center mb-4 text-lg font-bold">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-red-500" : ""
              }`}
            >
              Tk {product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span>
                Tk {product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentUpdatedId(product?._id);
              setFormData(product);
            }}
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
            size="lg"
          >
            Update
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            className="bg-red-500 hover:bg-red-600 w-full sm:w-auto"
            size="lg"
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default AdminProductTile;
