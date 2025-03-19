// AccountPage.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  productsThunks,
  exchangeThunks,
  doneThunks,
  freelanceThunks,
  transportThunks,
} from "../redux/slices/categorySlice";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";
import {
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../redux/slices/selectors/categorySelectors";
import ListingsSection from "../components/account/Listings";
import ProfileSection from "../components/account/Profile";
import ProductForm from "../components/account/ProductForm";
import ExchangeForm from "../components/account/ExchangeForm";
import TransportForm from "../components/account/TransportForm";
import FreelanceForm from "../components/account/FreelanceForm";
import DoneForm from "../components/account/DoneForm";
import { Product } from "../models/ProductModel";
import { Exchange } from "../models/ExchangeModel";
import { Transport } from "../models/TransportModel";
import { Freelance } from "../models/FreelanceModel";
import { Done } from "../models/DoneModel";
import Statistique from "../components/account/Statistique";

// Category configurations
const categoryModels = {
  Products: () => new Product({}),
  Exchange: () => new Exchange({}),
  Done: () => new Done({}),
  Freelance: () => new Freelance({}),
  Transport: () => new Transport({}),
};

const categoryModelsSubmit = {
  Products: Product,
  Exchange: Exchange,
  Done: Done,
  Freelance: Freelance,
  Transport: Transport,
};

const formComponents = {
  Products: ProductForm,
  Exchange: ExchangeForm,
  Transport: TransportForm,
  Freelance: FreelanceForm,
  Done: DoneForm,
};

// Utility functions
const convertDatesToStrings = (obj) => {
  const result = { ...obj };
  for (const key in result) {
    if (result[key] instanceof Date) {
      result[key] = result[key].toISOString().split("T")[0];
    } else if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = convertDatesToStrings(result[key]);
    }
  }
  return result;
};

const convertStringsToDates = (obj, dateFields) => {
  const result = { ...obj };
  dateFields.forEach((field) => {
    if (result[field] && typeof result[field] === "string") {
      result[field] = new Date(result[field]);
    }
  });
  return result;
};

// FormWrapper Component: Manages individual form state and logic
const FormWrapper = ({
  category,
  onSubmit,
  uploadImage,
  isLoading,
  handleAddPackage,
}) => {
  const [formData, setFormData] = useState(() => {
    const model = categoryModels[category]();
    return convertDatesToStrings(model);
  });
  const [localUploadError, setLocalUploadError] = useState(null);

  // Handle form input changes, including files and nested fields
  const handleFormChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      try {
        const uploadedImageUrls = await Promise.all(
          Array.from(files).map(uploadImage)
        );
        if (uploadedImageUrls.length > 0) {
          const imageField = category === "Done" ? "proofImages" : "images";
          setFormData((prev) => ({
            ...prev,
            [imageField]: [
              ...(Array.isArray(prev[imageField]) ? prev[imageField] : []),
              ...uploadedImageUrls,
            ],
          }));
          setLocalUploadError(null);
        }
      } catch (error) {
        setLocalUploadError(`Image upload failed: ${error.message}`);
      }
    } else if (name.includes(".")) {
      const [arrayName, index, field] = name.split(/[\].]+/);
      const parsedIndex = parseInt(index);
      setFormData((prev) => {
        const currentArray = Array.isArray(prev[arrayName])
          ? prev[arrayName]
          : [];
        const updatedArray = [...currentArray];
        while (updatedArray.length <= parsedIndex) updatedArray.push({});
        updatedArray[parsedIndex] = {
          ...updatedArray[parsedIndex],
          [field]: value,
        };
        return { ...prev, [arrayName]: updatedArray };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(category, formData);
  };

  const FormComponent = formComponents[category];

  return (
    <FormComponent
      formData={formData}
      handleFormChange={handleFormChange}
      handleSubmit={handleLocalSubmit}
      handleAddPackage={handleAddPackage}
      isLoading={isLoading}
      uploadError={localUploadError}
    />
  );
};

// AccountPage Component
const AccountPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState(null);
  const [, setUploadError] = useState(null);
  const { uploadImage, isLoading } = useCloudinaryUpload();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Fetch category data
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  // Fetch items on mount
  useEffect(() => {
    dispatch(productsThunks.fetchItemsById());
    dispatch(doneThunks.fetchItemsById());
    dispatch(exchangeThunks.fetchItemsById());
    dispatch(freelanceThunks.fetchItemsById());
    dispatch(transportThunks.fetchItemsById());
  }, [dispatch]);

  // Handle category selection
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    // Reset form data when category changes
    if (newCategory && categoryModels[newCategory]) {
      setFormData(convertDatesToStrings(categoryModels[newCategory]()));
    } else {
      setFormData(null);
    }
  };

  // Handle form submission
  const handleSubmit = (category, formData) => {
    console.log(formData);

    if (!user) {
      setUploadError("You must be signed in to add items.");
      return;
    }

    const thunks = {
      Products: productsThunks,
      Exchange: exchangeThunks,
      Done: doneThunks,
      Freelance: freelanceThunks,
      Transport: transportThunks,
    };

    const categoryThunks = thunks[category];
    if (!categoryThunks) {
      setUploadError("Invalid category.");
      return;
    }

    const dateFieldsByCategory = {
      Products: ["createdAt", "updatedAt"],
      Exchange: ["createdAt", "updatedAt", "closedAt"],
      Transport: ["createdAt", "updatedAt", "activeUntil"],
      Freelance: ["createdAt", "updatedAt"],
      Done: ["createdAt", "updatedAt", "completionDate", "completedAt"],
    };

    const dataWithOwner = {
      ...formData,
      [category === "Freelance" ? "freelancer" : "owner"]: {
        id: user.uid,
        name: user.name || "Anonymous",
        email: user.email,
        imageUrl: user.profilePicture || "",
      },
    };

    const dataWithDates = convertStringsToDates(
      dataWithOwner,
      dateFieldsByCategory[category] || []
    );

    const ModelClass = categoryModelsSubmit[category];
    const item = new ModelClass(dataWithDates);

    dispatch(categoryThunks.addItem(item))
      .unwrap()
      .then(() => {
        setSelectedCategory("");
        setUploadError(null);
        dispatch(categoryThunks.fetchItemsById());
      })
      .catch((error) => {
        setUploadError(`Failed to add item: ${error.message}`);
      });
  };

  // Handle adding a new package
  const handleAddPackage = (packageData) => {
    setFormData((prevFormData) => {
      console.log(packageData);
      return {
        ...prevFormData,
        packages: [packageData],
      };
    });
    console.log(formData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row flex-1 p-6 gap-4">
        {/* Left Sidebar */}
        <div className="flex flex-col md:w-1/3 bg-gray-100 gap-4">
          <ProfileSection user={user} />
          {/* <Notifications /> */}
          <Statistique />
        </div>
        {/* Middle Listings Section */}
        <ListingsSection
          loading={loading}
          error={error}
          shopItems={categories.products}
          doneItems={categories.done}
          exchangeItems={categories.exchange}
          freelanceItems={categories.freelance}
          transportItems={categories.transport}
        />
        {/* Right Form Section */}
        <div className="flex flex-col md:w-1/3 bg-gradient-to-b from-gray-100 to-gray-50 ">
          {/* Category selector always visible */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full mt-0 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 tracking-tight">
              Add New Listing
            </h2>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-green-400"
              }`}
              disabled={isLoading}
            >
              <option value="" className="text-gray-500">
                Select a Category
              </option>
              {Object.keys(categoryModels).map((category) => (
                <option
                  key={category}
                  value={category}
                  className="text-gray-800 py-2"
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Render all FormWrappers, only showing the selected one */}
          {selectedCategory && formData && (
            <div className="w-full">
              <FormWrapper
                category={selectedCategory}
                onSubmit={handleSubmit}
                uploadImage={uploadImage}
                isLoading={isLoading}
                handleAddPackage={handleAddPackage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
