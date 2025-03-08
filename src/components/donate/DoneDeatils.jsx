// components/DoneDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doneThunks } from "../../redux/slices/categorySlice";
import DoneInfo from "./DoneInfo";

const DoneDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Select from state.done, matching your Donate page
  const doneItems = useSelector((state) => state.done.items) || [];
  const loading = useSelector((state) => state.done.loading) || false;
  const error = useSelector((state) => state.done.error) || null;

  const [done, setDone] = useState(null);

  useEffect(() => {
    const foundDone = doneItems.find((item) => item.id === id);
    if (foundDone) {
      setDone(foundDone);
    } else if (!loading && !error) {
      dispatch(doneThunks.fetchItems())
        .unwrap()
        .then(() => {
          const refreshedDone = doneItems.find((item) => item.id === id);
          if (refreshedDone) {
            setDone(refreshedDone);
          } else {
            console.error(`Item with id ${id} not found after fetch`);
          }
        })
        .catch((err) => console.error("Failed to fetch done items:", err));
    }
  }, [id, doneItems, dispatch, loading, error]);

  const handleToggleFavorite = () => {
    alert(`${done?.doneTitle} toggled in favorites!`);
    // dispatch(toggleFavorite(done.id));
  };

  const handleSendRequest = () => {
    alert(`Request sent for ${done?.doneTitle}!`);
    // dispatch(sendRequest(done.id));
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

  if (!done) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-center text-gray-600 text-lg">
          No details found for this item.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gray-50">
      <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto p-4 sm:p-6 md:p-8 flex-1">
        {" "}
        <DoneInfo
          done={done}
          onToggleFavorite={handleToggleFavorite}
          onSendRequest={handleSendRequest}
        />
      </div>
    </div>
  );
};

export default DoneDetails;
