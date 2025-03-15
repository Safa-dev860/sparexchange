// components/DoneAccountEdit.js
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doneThunks } from "../../redux/slices/categorySlice"; // Adjust path
import { Done } from "../../models/DoneModel"; // Adjust path
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload"; // Adjust path

const DoneAccountEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const doneItems = useSelector((state) => state.done.items);
  const memoizedDoneItems = useMemo(() => doneItems, [doneItems]);
  const loading = useSelector((state) => state.done.loading);
  const error = useSelector((state) => state.done.error);

  const [done, setDone] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    doneTitle: "",
    completionDate: null,
    remarks: "",
    proofImages: [],
  });
  const [uploadError, setUploadError] = useState(null);

  const {
    uploadImage,
    isLoading: uploadLoading,
    error: cloudinaryError,
  } = useCloudinaryUpload();

  useEffect(() => {
    const foundDone = memoizedDoneItems.find((item) => item.id === id);
    if (foundDone) {
      const doneInstance = Done.fromFirestore(foundDone);
      setDone(doneInstance);
      const initialFormData = {
        doneTitle: doneInstance.doneTitle || "",
        completionDate: doneInstance.completionDate || null,
        remarks: doneInstance.remarks || "",
        proofImages: Array.isArray(doneInstance.proofImages)
          ? [...doneInstance.proofImages]
          : [],
      };
      setFormData(initialFormData);
      console.log("Initial formData set:", initialFormData);
    } else if (!loading && !error) {
      dispatch(doneThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedDone = memoizedDoneItems.find(
            (item) => item.id === id
          );
          if (refreshedDone) {
            const doneInstance = Done.fromFirestore(refreshedDone);
            setDone(doneInstance);
            const initialFormData = {
              doneTitle: doneInstance.doneTitle || "",
              completionDate: doneInstance.completionDate || null,
              remarks: doneInstance.remarks || "",
              proofImages: Array.isArray(doneInstance.proofImages)
                ? [...doneInstance.proofImages]
                : [],
            };
            setFormData(initialFormData);
            console.log("Initial formData set after fetch:", initialFormData);
          }
        })
        .catch((err) => console.error("Failed to fetch done items:", err));
    }
  }, [id, memoizedDoneItems, dispatch, loading, error]);

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
            console.log("Uploaded image URL:", url);
            return url;
          })
        );
        setFormData((prev) => {
          const newProofImages = [
            ...prev.proofImages,
            ...uploadedImageUrls.filter(Boolean),
          ];
          console.log("Updated formData.proofImages:", newProofImages);
          return { ...prev, proofImages: newProofImages };
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
      const newProofImages = prev.proofImages.filter(
        (_, index) => index !== indexToRemove
      );
      console.log("ProofImages after removal:", newProofImages);
      return { ...prev, proofImages: newProofImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadLoading) {
      console.log("Submission blocked: Image upload in progress");
      return;
    }
    const updatedData = {
      id: done.id,
      ownerId: done.ownerId,
      doneTitle: formData.doneTitle,
      completionDate: formData.completionDate
        ? new Date(formData.completionDate)
        : null,
      remarks: formData.remarks,
      proofImages: [...formData.proofImages],
      owner: done.owner,
      createdAt: done.createdAt,
      updatedAt: new Date(done.updatedAt),
      status: done.status,
      completedAt: done.completedAt,
      completedBy: done.completedBy,
    };

    try {
      console.log("Updating done item...");
      const result = await dispatch(
        doneThunks.updateItem({ id: done.id, data: updatedData })
      ).unwrap();
      console.log("Done item updated successfully:", result);
      setIsEditing(false);
      setDone(Done.fromFirestore(updatedData));
      alert("Done item updated successfully!");
    } catch (err) {
      console.error("Failed to update done item:", err);
      alert("Failed to update done item. Please try again.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !done) {
    return (
      <div className="text-center p-8 text-red-600">
        {error ? `Error: ${error.message}` : "Done item not found"}
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
                Edit Done Item
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
                    Done Title
                  </label>
                  <input
                    type="text"
                    name="doneTitle"
                    value={formData.doneTitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    placeholder="Enter done title"
                    required
                    disabled={uploadLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    disabled={uploadLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  rows="4"
                  placeholder="Add remarks"
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
                  {Array.isArray(formData.proofImages) &&
                  formData.proofImages.length > 0 ? (
                    formData.proofImages.map((img, index) => (
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
                {done.doneTitle}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Completion Date:</span>{" "}
                  {done.completionDate
                    ? new Date(done.completionDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Remarks</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {done.remarks || "No remarks available"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Proof Images
                </h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Array.isArray(done.proofImages) &&
                  done.proofImages.length > 0 ? (
                    done.proofImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${done.doneTitle} ${index}`}
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

export default DoneAccountEdit;
