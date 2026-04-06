import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const FeatureImage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const handleUplaodFeatureImage = () => {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        toast.success("Image uploaded successfully");
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getFeatureImages()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="lg:ml-[260px] mt-[60px]">
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUplaodFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div>
        {featureImageList && featureImageList.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {featureImageList.map((featureImage) => (
              <div key={featureImage._id}>
                <img
                  src={featureImage.image}
                  alt={featureImage._id}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureImage;
