import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  deleteAddress,
  fetchAllAddress,
  updateAddress,
} from "@/store/shop/address-slice";
import toast from "react-hot-toast";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
};

const Address = ({ setCurrentSelectedAddress, selectedId }) => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentUpdatedId, setCurrentUpdatedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const handleManageAddress = (e) => {
    e.preventDefault();

    if (addressList.length >= 3 && currentUpdatedId === null) {
      toast.error("You can add maximum 3 addresses");
      setFormData(initialAddressFormData);
      return;
    }

    currentUpdatedId !== null
      ? dispatch(
          updateAddress({
            userId: user?.id,
            addressId: currentUpdatedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id));
            setCurrentUpdatedId(null);
            setFormData(initialAddressFormData);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddress(user?.id));
            setFormData(initialAddressFormData);
            toast.success("Address added successfully");
          }
        });
  };

  const handleUpdateAddress = (getCurrentAddress) => {
    setCurrentUpdatedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
    });
  };

  const handleDeleteAddress = (getCurrentAddress) => {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
        toast.success("Address deleted successfully");
      }
    });
  };

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  };

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch]);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="font-bold">Address Lists</CardTitle>
      </CardHeader>
      <div className="mb-5 px-6 py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem, index) => (
              <AddressCard
                key={index}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleUpdateAddress={handleUpdateAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle className="font-bold">
          {currentUpdatedId !== null ? "Update Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentUpdatedId !== null ? "Update" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid() || user?.role === "guest"}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
