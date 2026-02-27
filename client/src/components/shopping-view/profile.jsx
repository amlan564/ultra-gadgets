import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { profileFormControls, updatePasswordFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuth,
  updateUserPassword,
  updateUserProfile,
} from "@/store/auth-slice";
import toast from "react-hot-toast";
import ProfileImageUpload from "./image-upload";

const Profile = () => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );
  const [userFormData, setUserFormData] = useState({
    name: user?.userName,
    email: user?.email,
  });

  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && !isAuthenticated && !isLoading) {
      dispatch(checkAuth(JSON.parse(token)));
    }
  }, [dispatch, isAuthenticated, isLoading]);

  useEffect(() => {
    if (user) {
      setUserFormData({
        name: user.userName,
        email: user.email,
      });
      setUploadedImageUrl(user.profileImage || "");
    }
  }, [user]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    if (!userFormData.name.trim()) {
      toast.error("Username is required");
      return;
    }

    dispatch(
      updateUserProfile({
        userId: user?.id,
        formData: {
          userName: userFormData.name,
          profileImage: uploadedImageUrl,
        },
      }),
    ).then((data) => {
      if (data.payload?.success) {
        toast.success("Profile updated successfully");
        setUserFormData((prev) => ({
          ...prev,
          name: data.payload.user.userName,
        }));
        setUploadedImageUrl(data.payload.user.profileImage || uploadedImageUrl);
        setImageFile(null);
      } else {
        toast.error(data.payload?.message || "Failed to update profile");
      }
    });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (!passwordFormData.oldPassword.trim()) {
      toast.error("Old password is required");
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    dispatch(
      updateUserPassword({
        userId: user?.id,
        formData: {
          oldPassword: passwordFormData.oldPassword,
          newPassword: passwordFormData.newPassword,
          confirmPassword: passwordFormData.confirmPassword,
        },
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setPasswordFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="font-bold">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProfileImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            imageLoadingState={imageLoadingState}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
          />
          <CommonForm
            formControls={profileFormControls.map((control) => ({
              ...control,
              readOnly: control.name === "email",
            }))}
            formData={userFormData}
            setFormData={setUserFormData}
            buttonText={"Update Information"}
            onSubmit={handleProfileUpdate}
            isBtnDisabled={!userFormData.name.trim()}
          />
        </CardContent>
      </Card>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="font-bold">Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CommonForm
            formControls={updatePasswordFormControls}
            formData={passwordFormData}
            setFormData={setPasswordFormData}
            buttonText={"Update Password"}
            onSubmit={handlePasswordUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
