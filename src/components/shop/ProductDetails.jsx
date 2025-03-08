// components/ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productsThunks } from "../../redux/slices/categorySlice"; // Adjust path to your product thunks
import { addToCart } from "../../redux/slices/cardSlice"; // Import addToCart action
import ProductInfoWidget from "./ProductInfoWidget";
import { Product } from "../../models/ProductModel";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select productItems directly with useSelector
  const productItems = useSelector((state) => state.products.items) || [];
  const loading = useSelector((state) => state.products.loading) || false;
  const error = useSelector((state) => state.products.error) || null;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = productItems.find((item) => item.id === id);
    if (foundProduct) {
      setProduct(Product.fromFirestore(foundProduct));
    } else if (!loading && !error) {
      dispatch(productsThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedProduct = productItems.find((item) => item.id === id);
          if (refreshedProduct) {
            setProduct(Product.fromFirestore(refreshedProduct));
          } else {
            console.log(`Product with id ${id} not found after fetch`);
          }
        })
        .catch((err) => console.error("Failed to fetch products:", err));
    }
  }, [id, productItems, dispatch, loading, error]);

  const handleToggleFavorite = () => {
    alert(`${product?.name} toggled in favorites!`);
    // dispatch(toggleFavorite(product.id));
  };

  const handleAddToCart = () => {
    if (product) {
      // Prepare the payload for addToCart action
      const cartItem = {
        id: product.id,
        name: product.name,
        price: parseInt(product.price),
        image: product.images[0] || "", // Use the first image or empty string if none
      };
      dispatch(addToCart(cartItem)); // Dispatch the action
      alert(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-red-600 text-lg">
          Error: {error.message || "Failed to load details."}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">
          No details found for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-50">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-4 sm:p-6 md:p-8 flex-1">
        <ProductInfoWidget
          product={product}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
