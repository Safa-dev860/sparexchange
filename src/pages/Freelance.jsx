import { useState, useEffect } from "react";
import Filters from "../components/sell/Filter";
import { useDispatch, useSelector } from "react-redux";
import { freelanceThunks } from "../redux/slices/categorySlice";
import GigsGrid from "../components/freelance/gigGrid";

const Freelance = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const dispatch = useDispatch();
  const products = useSelector((state) => state.freelance.items);
  const loading = useSelector((state) => state.freelance.loading);
  const error = useSelector((state) => state.freelance.error);

  const filteredItems = products
    // .filter((item) => item..toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (category ? item.category === category : true))
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  useEffect(() => {
    dispatch(freelanceThunks.fetchItems());
  }, [dispatch]);

  // Loading UI
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
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
          onClick={() => dispatch(freelanceThunks.fetchItems())} // Retry fetch
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
        Find freelancers in here
      </h1>
      <p className="text-gray-600 mt-2 text-center">
        Hire freelancers for your projects
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
      <GigsGrid items={filteredItems} />
    </div>
  );
};

export default Freelance;
