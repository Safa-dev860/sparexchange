import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { exchangeThunks } from "../../redux/slices/categorySlice"; // Adjust path
import { Exchange } from "../../models/ExchangeModel"; // Adjust path
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"; // Adjust path
import LocationPicker from "../LocationPicker"; // Import the reusable LocationPicker component
import ConditionDropdown from "../ConditionDropDown"; // Import the reusable ConditionDropdown component
import CustomPopup from "../CustomPopup"; // Import the CustomPopup component

const ExchangeAccountEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const exchangeItems = useSelector((state) => state.exchange.items);
  const memoizedExchangeItems = useMemo(() => exchangeItems, [exchangeItems]);
  const loading = useSelector((state) => state.exchange.loading);
  const error = useSelector((state) => state.exchange.error);

  const [exchange, setExchange] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    itemOffered: "",
    itemWanted: "",
    condition: "new",
    location: null, // Store location as an object { lat, lng, city }
    images: [],
  });
  const [uploadError, setUploadError] = useState(null);
  const [showMap, setShowMap] = useState(false); // State to control the map modal
  const [showPopup, setShowPopup] = useState(false); // State to control the CustomPopup
  const [popupConfig, setPopupConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "",
    cancelText: "",
  });

  const {
    uploadImage,
    isLoading: uploadLoading,
    error: cloudinaryError,
  } = useCloudinaryUpload();

  useEffect(() => {
    const foundExchange = memoizedExchangeItems.find((item) => item.id === id);
    if (foundExchange) {
      const exchangeInstance = Exchange.fromFirestore(foundExchange);
      setExchange(exchangeInstance);
      const initialFormData = {
        itemOffered: exchangeInstance.itemOffered || "",
        itemWanted: exchangeInstance.itemWanted || "",
        condition: exchangeInstance.condition || "new",
        location: exchangeInstance.location || null, // Initialize location as an object
        images: [...exchangeInstance.images],
      };
      setFormData(initialFormData);
    } else if (!loading && !error) {
      dispatch(exchangeThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedExchange = memoizedExchangeItems.find(
            (item) => item.id === id
          );
          if (refreshedExchange) {
            const exchangeInstance = Exchange.fromFirestore(refreshedExchange);
            setExchange(exchangeInstance);
            const initialFormData = {
              itemOffered: exchangeInstance.itemOffered || "",
              itemWanted: exchangeInstance.itemWanted || "",
              condition: exchangeInstance.condition || "new",
              location: exchangeInstance.location || null, // Initialize location as an object
              images: [...exchangeInstance.images],
            };
            setFormData(initialFormData);
          }
        })
        .catch((err) => console.error("Failed to fetch exchange items:", err));
    }
  }, [id, memoizedExchangeItems, dispatch, loading, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location, // Update the location object
    }));
    setShowMap(false); // Close the map modal
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
      console.log("Submission blocked: Image upload in progress");
      return;
    }
    const updatedData = {
      id: exchange.id,
      ownerId: exchange.ownerId,
      itemOffered: formData.itemOffered,
      itemWanted: formData.itemWanted,
      condition: formData.condition,
      location: formData.location, // Save the location object
      images: [...formData.images],
      updatedAt: new Date(exchange.updatedAt),
    };

    try {
      const result = await dispatch(
        exchangeThunks.updateItem({ id: exchange.id, data: updatedData })
      ).unwrap();
      setIsEditing(false);
      setExchange(Exchange.fromFirestore(updatedData));
      // Show success popup
      setPopupConfig({
        title: "Success",
        message: "Exchange item updated successfully!",
        onConfirm: () => setShowPopup(false),
        confirmText: "OK",
      });
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to update exchange item:", err);
      // Show error popup
      setPopupConfig({
        title: "Error",
        message: "Failed to update exchange item. Please try again.",
        onConfirm: () => setShowPopup(false),
        confirmText: "OK",
      });
      setShowPopup(true);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
          Lodding ...
        </div>
      </div>
    );
  }

  if (error || !exchange) {
    return (
      <div className="text-center p-8 text-red-600">
        {error ? `Error: ${error.message}` : "Exchange item not found"}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-100 min-h-screen mt-24">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-6 md:p-8 flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <button
            onClick={toggleEdit}
            className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Edit Exchange Item
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
                    Item Offered
                  </label>
                  <input
                    type="text"
                    name="itemOffered"
                    value={formData.itemOffered}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter item offered"
                    required
                    disabled={uploadLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Item Wanted
                  </label>
                  <input
                    type="text"
                    name="itemWanted"
                    value={formData.itemWanted}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter item wanted"
                    required
                    disabled={uploadLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <ConditionDropdown
                  value={formData.condition}
                  onChange={handleInputChange}
                  disabled={uploadLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 text-left"
                  disabled={uploadLoading}
                >
                  {formData.location?.city
                    ? `Location Selected: ${formData.location.city}`
                    : "Select a Location"}
                </button>
                {showMap && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-11/12 max-w-2xl">
                      <LocationPicker
                        initialLocation={formData.location}
                        onSelect={handleLocationSelect}
                        onClose={() => setShowMap(false)}
                      />
                    </div>
                  </div>
                )}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={uploadLoading}
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {exchange.itemOffered}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Item Wanted:</span>{" "}
                  {exchange.itemWanted}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Condition:</span>{" "}
                  {exchange.condition}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Location:</span>{" "}
                  {typeof exchange.location === "object"
                    ? exchange.location.city
                    : exchange.location}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Proof Images
                </h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Array.isArray(exchange.images) &&
                  exchange.images.length > 0 ? (
                    exchange.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${exchange.itemOffered} ${index}`}
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

      {/* Custom Popup */}
      <CustomPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        onConfirm={popupConfig.onConfirm}
        confirmText={popupConfig.confirmText}
        cancelText={popupConfig.cancelText}
      />
    </div>
  );
};

export default ExchangeAccountEdit;
