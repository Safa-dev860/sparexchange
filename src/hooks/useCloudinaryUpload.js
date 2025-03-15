import { useState } from "react";

const useCloudinaryUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const uploadImage = async (file) => {
    setIsLoading(true);
    setError(null);

    if (
      !process.env.REACT_APP_CLOUDINARY_API_URL ||
      !process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    ) {
      setError("Cloudinary API URL or upload preset is missing.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(process.env.REACT_APP_CLOUDINARY_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        throw new Error(errorData.error?.message || "Upload failed");
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
