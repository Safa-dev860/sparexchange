// components/ProductAccountEdit.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productsThunks } from "../../redux/slices/categorySlice";
import { Product } from "../../models/ProductModel";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"; // Adjust path
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icon
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// Define the SVG marker icon
const svgIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
    <path fill="#FF0000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
`;

// Create a Leaflet icon from the SVG
const customMarkerIcon = L.divIcon({
  html: svgIcon,
  iconSize: [36, 36], // Size of the SVG
  iconAnchor: [18, 36], // Anchor point (bottom center of the pin)
  className: "", // Remove default Leaflet class to avoid styling conflicts
});

// Tunisia Map component for editing location
const TunisiaMap = ({ initialLocation, onSelect, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation.lat && initialLocation.lng
      ? [initialLocation.lat, initialLocation.lng]
      : null
  );

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
      },
    });
    return null;
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation[0], selectedLocation[1]);
    }
  };

  return (
    <div>
      <MapContainer
        center={[33.8869, 9.5375]} // Center on Tunisia
        zoom={6} // Zoom level to show all of Tunisia
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {selectedLocation && (
          <Marker position={selectedLocation} icon={customMarkerIcon} />
        )}
      </MapContainer>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          type="button"
          onClick={handleConfirm}
          className="p-2 bg-green-500 text-white rounded-lg"
          disabled={!selectedLocation}
        >
          Confirm Location
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Read-only Map Popup component
const LocationMapPopup = ({ location, onClose }) => {
  const position =
    location.lat && location.lng
      ? [location.lat, location.lng]
      : [33.8869, 9.5375]; // Default to Tunisia center if no location

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-11/12 max-w-2xl">
        <MapContainer
          center={position}
          zoom={location.lat && location.lng ? 10 : 6} // Zoom in if location exists
          style={{ height: "400px", width: "100%" }}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {location.lat && location.lng && (
            <Marker position={position} icon={customMarkerIcon} />
          )}
        </MapContainer>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-gray-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductAccountEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productItems = useSelector((state) => state.products.items) || [];
  const loading = useSelector((state) => state.products.loading) || false;
  const error = useSelector((state) => state.products.error) || null;

  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    location: { lat: null, lng: null },
    images: [],
  });
  const [uploadError, setUploadError] = useState(null);
  const [priceError, setPriceError] = useState(null); // New state for price validation error

  const {
    uploadImage,
    isLoading: uploadLoading,
    error: cloudinaryError,
  } = useCloudinaryUpload();

  useEffect(() => {
    const foundProduct = productItems.find((item) => item.id === id);
    if (foundProduct) {
      const productInstance = Product.fromFirestore(foundProduct);
      setProduct(productInstance);
      const initialFormData = {
        name: productInstance.name || "",
        price: String(productInstance.price) || "",
        category: productInstance.category || "",
        description: productInstance.description || "",
        location: productInstance.location || { lat: null, lng: null },
        images: Array.isArray(productInstance.images)
          ? [...productInstance.images]
          : [],
      };
      setFormData(initialFormData);
      console.log("Initial formData set:", initialFormData);
    } else if (!loading && !error) {
      dispatch(productsThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedProduct = productItems.find((item) => item.id === id);
          if (refreshedProduct) {
            const productInstance = Product.fromFirestore(refreshedProduct);
            setProduct(productInstance);
            const initialFormData = {
              name: productInstance.name || "",
              price: String(productInstance.price) || "",
              category: productInstance.category || "",
              description: productInstance.description || "",
              location: productInstance.location || { lat: null, lng: null },
              images: Array.isArray(productInstance.images)
                ? [...productInstance.images]
                : [],
            };
            setFormData(initialFormData);
            console.log("Initial formData set after fetch:", initialFormData);
          }
        })
        .catch((err) => console.error("Failed to fetch products:", err));
    }
  }, [id, productItems, dispatch, loading, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const numValue = parseFloat(value);
      if (value === "" || (numValue > 0 && !isNaN(numValue))) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setPriceError(null); // Clear error if valid
      } else {
        setPriceError("Price must be a positive number greater than 0");
      }
    } else {
      setFormData((prev) => {
        const newFormData = { ...prev, [name]: value };
        console.log(`Form field ${name} updated to:`, value);
        return newFormData;
      });
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => {
      const newFormData = { ...prev, location: { lat, lng } };
      console.log("Location updated to:", { lat, lng });
      setShowMapModal(false);
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
            console.log("Uploaded image URL:", url);
            return url;
          })
        );
        setFormData((prev) => {
          const newImages = [
            ...prev.images,
            ...uploadedImageUrls.filter(Boolean),
          ];
          console.log("Updated formData.images:", newImages);
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
      console.log("Images after removal:", newImages);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadLoading) {
      console.log("Submission blocked: Image upload in progress");
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (!priceValue || priceValue <= 0) {
      setPriceError("Price must be a positive number greater than 0");
      return;
    }

    const updatedData = {
      id: product.id,
      ownerId: product.ownerId,
      name: formData.name || "",
      price: priceValue,
      description: formData.description || "",
      images: Array.isArray(formData.images) ? [...formData.images] : [],
      category: formData.category || "",
      location: formData.location,
      owner: product.owner || { id: null, name: "", email: "", imageUrl: "" },
      createdAt: product.createdAt,
      updatedAt: new Date(),
    };

    console.log("Data being sent to updateItem:", updatedData);

    try {
      const result = await dispatch(
        productsThunks.updateItem({ id: product.id, data: updatedData })
      ).unwrap();
      console.log("Update result:", result);
      setIsEditing(false);
      setProduct(Product.fromFirestore(updatedData));
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const categories = ["Plastic", "Paper", "Glass", "Metal", "Electronics"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center p-8 text-red-600">
        {error ? `Error: ${error.message}` : "Product not found"}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-100 min-h-screen">
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
                Edit Product
              </h2>
              {(uploadError || cloudinaryError || priceError) && (
                <p className="text-red-600 text-sm">
                  {uploadError || cloudinaryError || priceError}
                </p>
              )}
              {uploadLoading && (
                <p className="text-blue-600 text-sm">Uploading images...</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter product name"
                    required
                    disabled={uploadLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (DT)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${
                      priceError ? "border-red-500" : ""
                    }`}
                    placeholder="Enter price in DT"
                    min="1" // Ensures positive value
                    step="1"
                    required
                    disabled={uploadLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    disabled={uploadLoading}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="mt-1 w-full bg-blue-100 text-blue-700 p-2 rounded-md hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadLoading}
                >
                  {formData.location.lat && formData.location.lng
                    ? `Lat: ${formData.location.lat.toFixed(
                        4
                      )}, Lng: ${formData.location.lng.toFixed(4)}`
                    : "Edit Location"}
                </button>
                {showMapModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-11/12 max-w-2xl">
                      <TunisiaMap
                        initialLocation={formData.location}
                        onSelect={handleLocationSelect}
                        onClose={() => setShowMapModal(false)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  rows="4"
                  placeholder="Describe your product"
                  disabled={uploadLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Images
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
                          src={
                            typeof img === "string"
                              ? img
                              : URL.createObjectURL(img)
                          }
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
                  disabled={uploadLoading || priceError}
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {product.name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Price:</span> {product.price}{" "}
                  DT
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Location
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLocationPopup(true)}
                  className="mt-1 w-full bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition"
                >
                  {product.location.lat && product.location.lng
                    ? `Lat: ${product.location.lat.toFixed(
                        4
                      )}, Lng: ${product.location.lng.toFixed(4)}`
                    : "View Location"}
                </button>
                {showLocationPopup && (
                  <LocationMapPopup
                    location={product.location}
                    onClose={() => setShowLocationPopup(false)}
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description || "No description available"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Images</h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Array.isArray(product.images) &&
                  product.images.length > 0 ? (
                    product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${product.name} ${index}`}
                        className="w-32 h-32 object-cover rounded-md shadow-sm"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No images available</p>
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

export default ProductAccountEdit;
