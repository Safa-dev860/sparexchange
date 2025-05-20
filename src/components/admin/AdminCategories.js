import { useState } from "react";
import AdminProductsList from "./AdminProductsList";
import AdminExchangesList from "./AdminExchnageList";
import AdminDoneList from "./AdminDonateList";
import AdminFreelanceList from "./AdminFreelanceList";
import AdminTransportList from "./AdminTransportList";

const AdminCategories = () => {
  const [activeCategory, setActiveCategory] = useState("Products");

  const categories = [
    "Products",
    "Exchnage",
    "Donate",
    "Freelnace",
    "Transport",
  ];

  const renderCategoryComponent = () => {
    switch (activeCategory) {
      case "Products":
        return <AdminProductsList />;
      case "Exchnage":
        return <AdminExchangesList />;
      case "Donate":
        return <AdminDoneList />;
      case "Freelnace":
        return <AdminFreelanceList />;
      case "Transport":
        return <AdminTransportList />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <nav className="mb-4">
        <ul className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md transition-all duration-300 
                  ${
                    activeCategory === category
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6">{renderCategoryComponent()}</div>
    </div>
  );
};

export default AdminCategories;
