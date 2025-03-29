// components/ExchangeDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { exchangeThunks } from "../../redux/slices/categorySlice"; // Adjust path to your exchange thunks
import ExchangeInfoWidget from "./ExchangeInfoWidget";
import { Exchange } from "../../models/ExchangeModel";

const ExchangeDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select exchangeItems directly with useSelector
  const exchangeItems = useSelector((state) => state.exchange.items) || [];
  const loading = useSelector((state) => state.exchange.loading) || false;
  const error = useSelector((state) => state.exchange.error) || null;

  const [exchange, setExchange] = useState(null);

  useEffect(() => {
    const foundExchange = exchangeItems.find((item) => item.id === id);
    if (foundExchange) {
      setExchange(Exchange.fromFirestore(foundExchange));
    } else if (!loading && !error) {
      dispatch(exchangeThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedExchange = exchangeItems.find(
            (item) => item.id === id
          );
          if (refreshedExchange) {
            setExchange(Exchange.fromFirestore(refreshedExchange));
          } else {
            // console.log(`Exchange with id ${id} not found after fetch`);
          }
        })
        .catch((err) => console.error("Failed to fetch exchanges:", err));
    }
  }, [id, exchangeItems, dispatch, loading, error]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
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

  if (!exchange) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">
          No details found for this exchange.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-50 mt-24">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-4 sm:p-6 md:p-8 flex-1">
        <ExchangeInfoWidget exchange={exchange} />
      </div>
    </div>
  );
};

export default ExchangeDetails;
