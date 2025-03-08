import { useState } from "react";

const useCloudinaryUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Your Cloudinary upload preset and cloud name
  const CLOUDINARY_UPLOAD_PRESET = "sparexchange";
  const CLOUDINARY_CLOUD_NAME = "dfjvuauae";
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const uploadImage = async (file) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      return data.secure_url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadImage,
    isLoading,
    error,
    imageUrl,
  };
};

export default useCloudinaryUpload;
