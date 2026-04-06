import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CloudUpload, File, X } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ProductImageUpload = ({
  imageFiles,
  setImageFiles,
  imageLoadingState,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) => {
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) setImageFiles((prev) => [...prev, ...selected]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) setImageFiles((prev) => [...prev, ...dropped]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (files) => {
    setImageLoadingState(true);

    const data = new FormData();

    files.forEach((file) => data.append("my_files", file));

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
      data,
    );

    if (response?.data?.success) {
      setUploadedImageUrls(response.data.urls);
    }
    setImageLoadingState(false);
  };

  useEffect(() => {
    if (imageFiles?.length > 0) uploadImagesToCloudinary(imageFiles);
  }, [imageFiles]);

  return (
    <div className={`w-full ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-50" : ""
        } border-2 border-gray-5900 border-dashed rounded-lg p-2`}
      >
        <Input
          id="image-upload"
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        <Label
          htmlFor="image-upload"
          className={`${
            isEditMode ? "cursor-not-allowed" : ""
          } flex flex-col items-center justify-center h-32 cursor-pointer`}
        >
          <CloudUpload className="w-10 h-10" />
          <span>Drag & drop or click to upload images</span>
        </Label>
      </div>

      {/* Preview list */}
      {imageLoadingState ? (
        <Skeleton className="h-10 bg-gray-200 mt-2" />
      ) : (
        imageFiles?.length > 0 && (
          <ul className="mt-3 space-y-2">
            {imageFiles.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between border rounded p-2"
              >
                <div className="flex items-center gap-2">
                  <File className="w-5 h-5" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveImage(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default ProductImageUpload;
