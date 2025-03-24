// components/FreelanceAccountEdit.js
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { freelanceThunks } from "../../redux/slices/categorySlice"; // Adjust path
import { Freelance } from "../../models/FreelanceModel"; // Adjust path
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"; // Adjust path

const FreelanceAccountEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const freelanceItems = useSelector((state) => state.freelance.items);
  const memoizedFreelanceItems = useMemo(
    () => freelanceItems,
    [freelanceItems]
  );
  const loading = useSelector((state) => state.freelance.loading);
  const error = useSelector((state) => state.freelance.error);

  const [gig, setGig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    gigTitle: "",
    category: "",
    description: "",
    technologies: [],
    images: [],
    packages: [],
  });
  const [uploadError, setUploadError] = useState(null);

  const {
    uploadImage,
    isLoading: uploadLoading,
    error: cloudinaryError,
  } = useCloudinaryUpload();

  useEffect(() => {
    const foundGig = memoizedFreelanceItems.find((item) => item.id === id);
    if (foundGig) {
      const gigInstance = Freelance.fromFirestore(foundGig);
      setGig(gigInstance);
      const initialFormData = {
        gigTitle: gigInstance.gigTitle || "",
        category: gigInstance.category || "",
        description: gigInstance.description || "",
        technologies: Array.isArray(gigInstance.technologies)
          ? [...gigInstance.technologies]
          : [],
        images: Array.isArray(gigInstance.images)
          ? [...gigInstance.images]
          : [],
        packages: Array.isArray(gigInstance.packages)
          ? [...gigInstance.packages]
          : [],
      };
      setFormData(initialFormData);
      console.log("Initial formData set:", initialFormData);
    } else if (!loading && !error) {
      dispatch(freelanceThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedGig = memoizedFreelanceItems.find(
            (item) => item.id === id
          );
          if (refreshedGig) {
            const gigInstance = Freelance.fromFirestore(refreshedGig);
            setGig(gigInstance);
            const initialFormData = {
              gigTitle: gigInstance.gigTitle || "",
              category: gigInstance.category || "",
              description: gigInstance.description || "",
              technologies: Array.isArray(gigInstance.technologies)
                ? [...gigInstance.technologies]
                : [],
              images: Array.isArray(gigInstance.images)
                ? [...gigInstance.images]
                : [],
              packages: Array.isArray(gigInstance.packages)
                ? [...gigInstance.packages]
                : [],
            };
            setFormData(initialFormData);
            console.log("Initial formData set after fetch:", initialFormData);
          }
        })
        .catch((err) => console.error("Failed to fetch gigs:", err));
    }
  }, [id, memoizedFreelanceItems, dispatch, loading, error]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      return newFormData;
    });
  };

  const handleTechnologiesChange = (e) => {
    const value = e.target.value;
    if (value.trim() && e.key === "Enter") {
      setFormData((prev) => {
        const newTechnologies = [...prev.technologies, value.trim()];
        console.log("Technologies updated to:", newTechnologies);
        e.target.value = ""; // Clear input
        return { ...prev, technologies: newTechnologies };
      });
    }
  };

  const removeTechnology = (indexToRemove) => {
    setFormData((prev) => {
      const newTechnologies = prev.technologies.filter(
        (_, index) => index !== indexToRemove
      );
      console.log("Technologies after removal:", newTechnologies);
      return { ...prev, technologies: newTechnologies };
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

  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => {
      const newPackages = [...prev.packages];
      newPackages[index] = { ...newPackages[index], [field]: value };
      console.log("Packages updated to:", newPackages);
      return { ...prev, packages: newPackages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadLoading) {
      console.log("Submission blocked: Image upload in progress");
      return;
    }
    const updatedData = {
      id: gig.id,
      ownerId: gig.ownerId,
      gigTitle: formData.gigTitle,
      description: formData.description,
      category: formData.category,
      technologies: [...formData.technologies],
      images: [...formData.images],
      packages: [...formData.packages],
      freelancer: gig.freelancer,
      createdAt: gig.createdAt,
      updatedAt: new Date(gig.createdAt),
      conversations: gig.conversations,
      status: gig.status,
    };

    try {
      console.log("Updating gig...");
      const result = await dispatch(
        freelanceThunks.updateItem({ id: gig.id, data: updatedData })
      ).unwrap();
      console.log("Gig updated successfully:", result);
      setIsEditing(false);
      setGig(Freelance.fromFirestore(updatedData));
      alert("Gig updated successfully!");
    } catch (err) {
      console.error("Failed to update gig:", err);
      alert("Failed to update gig. Please try again.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const categories = ["Design", "Development", "Writing", "Marketing", "Other"]; // Adjust as needed

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="text-center p-8 text-red-600">
        {error ? `Error: ${error.message}` : "Gig not found"}
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
              <h2 className="text-2xl font-semibold text-gray-800">Edit Gig</h2>
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
                    Gig Title
                  </label>
                  <input
                    type="text"
                    name="gigTitle"
                    value={formData.gigTitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter gig title"
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
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  rows="4"
                  placeholder="Describe your gig"
                  disabled={uploadLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Technologies
                </label>
                <input
                  type="text"
                  onKeyDown={handleTechnologiesChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Type a technology and press Enter"
                  disabled={uploadLoading}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
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
                  ))}
                </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Packages
                </label>
                {formData.packages.map((pkg, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) =>
                        handlePackageChange(index, "title", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Package Title"
                      disabled={uploadLoading}
                    />
                    <textarea
                      value={pkg.description}
                      onChange={(e) =>
                        handlePackageChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Package Description"
                      disabled={uploadLoading}
                    />
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) =>
                        handlePackageChange(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Price"
                      min="0"
                      disabled={uploadLoading}
                    />
                    <input
                      type="number"
                      value={pkg.revisions}
                      onChange={(e) =>
                        handlePackageChange(
                          index,
                          "revisions",
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Revisions"
                      min="0"
                      disabled={uploadLoading}
                    />
                    <input
                      type="number"
                      value={pkg.deliveryTime}
                      onChange={(e) =>
                        handlePackageChange(
                          index,
                          "deliveryTime",
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      placeholder="Delivery Time (days)"
                      min="1"
                      disabled={uploadLoading}
                    />
                  </div>
                ))}
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
                {gig.gigTitle}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Category:</span>{" "}
                  {gig.category}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {gig.description || "No description available"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gig.technologies.length > 0 ? (
                    gig.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No technologies listed</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Images</h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Array.isArray(gig.images) && gig.images.length > 0 ? (
                    gig.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${gig.gigTitle} ${index}`}
                        className="w-32 h-32 object-cover rounded-md shadow-sm"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No images available</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Packages
                </h3>
                {gig.packages.length > 0 ? (
                  gig.packages.map((pkg, index) => (
                    <div key={index} className="border p-4 rounded-md mb-4">
                      <p>
                        <strong>Title:</strong> {pkg.title}
                      </p>
                      <p>
                        <strong>Description:</strong> {pkg.description}
                      </p>
                      <p>
                        <strong>Price:</strong> ${pkg.price}
                      </p>
                      <p>
                        <strong>Revisions:</strong> {pkg.revisions}
                      </p>
                      <p>
                        <strong>Delivery Time:</strong> {pkg.deliveryTime} days
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No packages available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelanceAccountEdit;
