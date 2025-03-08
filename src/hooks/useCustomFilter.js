// src/hooks/useCustomFilter.js
import { useState, useMemo } from "react";

const useCustomFilter = (items) => {
  const [filters, setFilters] = useState({
    category: null,
    minPrice: null,
    maxPrice: null,
    searchTerm: null,
  });

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by category
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      result = result.filter((item) => {
        const price = parseFloat(item.price) || 0; // Default to 0 if price is absent
        const min = filters.minPrice !== null ? filters.minPrice : -Infinity;
        const max = filters.maxPrice !== null ? filters.maxPrice : Infinity;
        return price >= min && price <= max;
      });
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter((item) => {
        const name =
          item.name ||
          item.taskTitle ||
          item.gigTitle ||
          item.vehicleType ||
          item.itemOffered ||
          "";
        return name.toLowerCase().includes(term);
      });
    }

    return result;
  }, [items, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { filteredItems, handleFilterChange };
};

export default useCustomFilter;
