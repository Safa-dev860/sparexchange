// components/GigDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { freelanceThunks } from "../../redux/slices/categorySlice"; // Adjust path to your thunks
import GigInfoWidget from "./GigInfoWidget";

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select freelanceItems directly with useSelector
  const freelanceItems = useSelector((state) => state.freelance.items) || [];
  const loading = useSelector((state) => state.freelance.loading) || false;
  const error = useSelector((state) => state.freelance.error) || null;

  const [gig, setGig] = useState(null);

  useEffect(() => {
    const foundGig = freelanceItems.find((item) => item.id === id);
    if (foundGig) {
      setGig(foundGig);
    } else if (!loading && !error) {
      dispatch(freelanceThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedGig = freelanceItems.find((item) => item.id === id);
          if (refreshedGig) {
            setGig(refreshedGig);
          } else {
            console.log(`Gig with id ${id} not found after fetch`);
          }
        })
        .catch((err) => console.error("Failed to fetch freelance items:", err));
    }
  }, [id, freelanceItems, dispatch, loading, error]);

  const handleToggleFavorite = () => {
    alert(`${gig?.gigTitle} toggled in favorites!`);
    // dispatch(toggleFavorite(gig.id));
  };

  const handleSendRequest = () => {
    alert(`Request sent for ${gig?.gigTitle}!`);
    // dispatch(sendRequest(gig.id));
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

  if (!gig) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">
          No details found for this gig.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-50">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-4 sm:p-6 md:p-8 flex-1">
        <GigInfoWidget
          gig={gig}
          onToggleFavorite={handleToggleFavorite}
          onSendRequest={handleSendRequest}
        />
      </div>
    </div>
  );
};

export default GigDetails;
