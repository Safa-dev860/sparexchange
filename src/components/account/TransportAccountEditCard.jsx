import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { transportThunks } from "../../redux/slices/categorySlice"; // Adjust path
import { Transport } from "../../models/TransportModel"; // Adjust path
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"; // Adjust path

const TransportAccountEditCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const transportItems = useSelector((state) => state.transport.items);
  const memoizedTransportItems = useMemo(
    () => transportItems,
    [transportItems]
  );
  const loading = useSelector((state) => state.transport.loading);
  const error = useSelector((state) => state.transport.error);

  const [transport, setTransport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "",
    capacity: 0,
    route: "",
    price: 0,
    images: [],
  });
  const [uploadError, setUploadError] = useState(null);

  const {
    uploadImage,
    isLoading: uploadLoading,
    error: cloudinaryError,
  } = useCloudinaryUpload();

  useEffect(() => {
    const foundTransport = memoizedTransportItems.find(
      (item) => item.id === id
    );
    if (foundTransport) {
      const transportInstance = Transport.fromFirestore(foundTransport);
      setTransport(transportInstance);
      const initialFormData = {
        vehicleType: transportInstance.vehicleType || "",
        capacity: transportInstance.capacity || 0,
        route: transportInstance.route || "",
        price: transportInstance.price || 0,
        images: [...transportInstance.images],
      };
      setFormData(initialFormData);
      // console.log("Initial formData set:", initialFormData);
    } else if (!loading && !error) {
      dispatch(transportThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedTransport = memoizedTransportItems.find(
            (item) => item.id === id
          );
          if (refreshedTransport) {
            const transportInstance =
              Transport.fromFirestore(refreshedTransport);
            setTransport(transportInstance);
            const initialFormData = {
              vehicleType: transportInstance.vehicleType || "",
              capacity: transportInstance.capacity || 0,
              route: transportInstance.route || "",
              price: transportInstance.price || 0,
              images: [...transportInstance.images],
            };
            setFormData(initialFormData);
          }
        })
        .catch((err) => console.error("Failed to fetch transport items:", err));
    }
  }, [id, memoizedTransportItems, dispatch, loading, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      return newFormData;
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const uploadedImageUrls = await Promise.all(
          files.map(async (file) => {
            const url = await uploadImage(file);
            return url;
          })
        );
        setFormData((prev) => {
          const newImages = [
            ...prev.images,
            ...uploadedImageUrls.filter(Boolean),
          ];
          return { ...prev, images: newImages };
        });
        setUploadError(null);
      } catch (error) {
        setUploadError(`Image upload failed: ${error.message}`);
        console.error("Image upload error:", error);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => {
      const newImages = prev.images.filter(
        (_, index) => index !== indexToRemove
      );
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadLoading) {
      console.log("Uploading Images...");
      return;
    }
    const updatedData = {
      id: transport.id,
      ownerId: transport.ownerId, // Ensure ownerId is included and unchanged
      vehicleType: formData.vehicleType,
      capacity: formData.capacity,
      route: formData.route,
      price: formData.price,
      images: [...formData.images],
      updatedAt: new Date(transport.updatedAt),
    };

    try {
      console.log("Updating transport item...");
      const result = await dispatch(
        transportThunks.updateItem({ id: transport.id, data: updatedData })
      ).unwrap();
      // console.log("Transport item updated successfully:", result);
      setIsEditing(false);
      setTransport(Transport.fromFirestore(updatedData));
      alert("Transport item updated successfully!");
    } catch (err) {
      console.error("Failed to update transport item:", err);
      alert("Failed to update transport item. Please try again.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !transport) {
    return (
      <div className="text-center p-8 text-red-600">
        {error ? `Error: ${error.message}` : "Transport item not found"}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-100 min-h-screen">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-6 md:p-8 flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <button
            onClick={toggleEdit}
            className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={uploadLoading}
          >
            {isEditing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            )}
          </button>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Transport Item
              </h2>
              {(uploadError || cloudinaryError) && (
                <p className="text-red-600 text-sm">
                  {uploadError || cloudinaryError}
                </p>
              )}
              {uploadLoading && (
                <p className="text-blue-600 text-sm">Uploading images...</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                    placeholder="Enter vehicle type"
                    required
                    disabled={uploadLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                    placeholder="Enter capacity"
                    required
                    disabled={uploadLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Route
                </label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                  placeholder="Enter route"
                  disabled={uploadLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price per Trip
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                  placeholder="Enter price per trip"
                  disabled={uploadLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proof Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploadLoading}
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  {Array.isArray(formData.images) &&
                  formData.images.length > 0 ? (
                    formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          title="Remove Image"
                          disabled={uploadLoading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No images selected</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  disabled={uploadLoading}
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {transport.vehicleType}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Capacity:</span>{" "}
                  {transport.capacity}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Route:</span>{" "}
                  {transport.route}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Price per Trip:</span> $
                  {transport.price}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Proof Images
                </h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Array.isArray(transport.images) &&
                  transport.images.length > 0 ? (
                    transport.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${transport.vehicleType} ${index}`}
                        className="w-32 h-32 object-cover rounded-md shadow-sm"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No proof images available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportAccountEditCard;
