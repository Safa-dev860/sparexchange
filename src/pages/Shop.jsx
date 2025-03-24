import { useState, useEffect } from "react";
import Filters from "../components/sell/Filter";
import { useDispatch, useSelector } from "react-redux";
import { productsThunks } from "../redux/slices/categorySlice";
import ShopGrid from "../components/shop/ShopGrid";

const Shop = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const filteredItems = products
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (category ? item.category === category : true))
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  useEffect(() => {
    dispatch(productsThunks.fetchItems());
  }, [dispatch]);

  // Loading UI
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold mb-4">
          Error: {error.message || "Failed to load products"}
        </p>
        <button
          onClick={() => dispatch(productsThunks.fetchItems())} // Retry fetch
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-32">
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Buy and Sell Recyclable Items
      </h1>
      <p className="text-gray-600 mt-2 text-center">
        Find the best deals on recyclable items in your area.
      </p>

      {/* Filters Component */}
      <Filters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Grid Component */}
      <ShopGrid items={filteredItems} />
    </div>
  );
};

export default Shop;
