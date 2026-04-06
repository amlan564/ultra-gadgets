import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CircleCheck, Pencil, Trash2 } from "lucide-react";

const AddressCard = ({
  addressInfo,
  handleUpdateAddress,
  handleDeleteAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`${
        selectedId?._id === addressInfo?._id
          ? "border border-green-500"
          : "border border-gray-300"
      } shadow-md cursor-pointer relative`}
    >
      {selectedId?._id === addressInfo?._id && (
        <CircleCheck className="absolute top-5 right-5 fill-green-500 text-white size-8" />
      )}
      <CardContent className="flex flex-col gap-2 px-6">
        <p className="text-sm font-semibold">
          {addressInfo?.address}, {addressInfo?.city}
        </p>
        <p className="text-sm text-gray-600">Postal Code: {addressInfo?.postalCode}</p>
        <p className="text-sm text-gray-600">Phone: {addressInfo?.phone}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        <Button
          className="bg-green-500 hover:bg-green-600 transition-all"
          onClick={() => handleUpdateAddress(addressInfo)}
        >
          <Pencil />
          Edit
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 transition-all"
          onClick={() => handleDeleteAddress(addressInfo)}
        >
          <Trash2 />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
