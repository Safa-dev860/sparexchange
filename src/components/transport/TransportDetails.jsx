// components/TransportDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { transportThunks } from "../../redux/slices/categorySlice"; // Adjust path to your transport thunks
import TransportInfoWidget from "./TransportInfoWidget";
import { Transport } from "../../models/TransportModel";

const TransportDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select transportItems directly with useSelector
  const transportItems = useSelector((state) => state.transport.items) || [];
  const loading = useSelector((state) => state.transport.loading) || false;
  const error = useSelector((state) => state.transport.error) || null;

  const [transport, setTransport] = useState(null);

  useEffect(() => {
    const foundTransport = transportItems.find((item) => item.id === id);
    if (foundTransport) {
      setTransport(Transport.fromFirestore(foundTransport));
    } else if (!loading && !error) {
      dispatch(transportThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedTransport = transportItems.find(
            (item) => item.id === id
          );
          if (refreshedTransport) {
            setTransport(Transport.fromFirestore(refreshedTransport));
          } else {
            console.log(`Transport with id ${id} not found after fetch`);
          }
        })
        .catch((err) => console.error("Failed to fetch transports:", err));
    }
  }, [id, transportItems, dispatch, loading, error]);

  const handleToggleFavorite = () => {
    alert(`${transport?.vehicleType} toggled in favorites!`);
    // dispatch(toggleFavorite(transport.id));
  };

  const handleBookTransport = () => {
    alert(`Booking requested for ${transport?.vehicleType}!`);
    // dispatch(bookTransport(transport.id));
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

  if (!transport) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">
          No details found for this transport.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-50">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-4 sm:p-6 md:p-8 flex-1">
        <TransportInfoWidget
          transport={transport}
          onToggleFavorite={handleToggleFavorite}
          onBookTransport={handleBookTransport}
        />
      </div>
    </div>
  );
};

export default TransportDetails;
