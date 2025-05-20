import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

const AdminTransportList = () => {
  const { documents, loading, error, deleteDocument } =
    useFirestoreCollection("Transport");

  const handleDelete = async (id) => {
    await deleteDocument(id);
  };

  if (loading) return <div className="p-4">Loading transport entries...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="py-6">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {documents.map((transport) => (
          <div
            key={transport.id}
            className="min-w-[300px] flex-shrink-0 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden relative"
          >
            {/* Image */}
            <img
              src={transport.images?.[0]}
              alt="Transport"
              className="w-full h-48 object-cover"
            />

            {/* Details */}
            <div className="p-4 pb-14">
              <h3 className="text-lg font-semibold mb-1">
                Route: {transport.requests?.route}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Vehicle: {transport.vehicleType}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Capacity: {transport.capacity}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Price: {transport.price} TND
              </p>
              <p className="text-sm mb-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    transport.requests?.status === "active"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {transport.requests?.status}
                </span>
              </p>

              {/* Owner Info */}
              <div className="text-xs text-gray-500 mt-3">
                <p>Owner: {transport.owner?.name || "N/A"}</p>
                <p>Email: {transport.owner?.email}</p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(transport.id)}
              className="absolute bottom-3 right-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTransportList;
