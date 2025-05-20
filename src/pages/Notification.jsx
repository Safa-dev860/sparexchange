import React, { useEffect, useState } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import { useRecommendations } from "../hooks/endpoints";

const Notification = () => {
  const { user, loading: loadingUser } = useCurrentUser();
  const { getRecommendations, loading: loadingRecommendations } =
    useRecommendations();

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!loadingUser && user) {
        const res = await getRecommendations(user.id);
        const recommendations = res.data.recommendations || [];
        const allProducts = res.data.products || [];

        // Extract recommendation IDs
        const recommendedIds = recommendations.map((rec) => rec.id);

        // Filter the actual product details
        const matchedProducts = allProducts.filter((prod) =>
          recommendedIds.includes(prod.id)
        );

        setRecommendedProducts(matchedProducts);
      }
    };

    fetchRecommendations();
  }, [getRecommendations, user, loadingUser]);

  if (loadingRecommendations) return <div>Loading recommendations...</div>;

  return (
    <div className="mt-24 mb-24 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recommended for you
      </h2>
      {recommendedProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No recommendations available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                Category: {item.category}
              </p>
              <p className="text-green-600 font-bold mt-2">{item.price} DT</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
