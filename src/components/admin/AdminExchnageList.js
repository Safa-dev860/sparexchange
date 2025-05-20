import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

const AdminExchangesList = () => {
  const { documents, loading, error, deleteDocument } =
    useFirestoreCollection("Exchange");

  const handleDelete = async (id) => {
    await deleteDocument(id);
  };

  if (loading) return <div className="p-4">Loading exchanges...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="py-6">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {documents.map((exchange) => (
          <div
            key={exchange.id}
            className="min-w-[300px] flex-shrink-0 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden relative"
          >
            {/* Exchange Image */}
            <img
              src={exchange.images?.[0]}
              alt={exchange.itemOffered}
              className="w-full h-48 object-cover"
            />

            {/* Exchange Details */}
            <div className="p-4 pb-14">
              <h3 className="text-lg font-semibold mb-1">
                {exchange.itemOffered}
              </h3>
              <p className="text-gray-600 mb-1 text-sm">
                Wanted:{" "}
                <span className="font-medium">{exchange.itemWanted}</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Condition: {exchange.condition}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    exchange.requests?.status === "open"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {exchange.requests?.status}
                </span>
              </p>
              <div className="text-xs text-gray-500 mt-2">
                <p>Location: {exchange.location?.city}</p>
                <p>Owner: {exchange.owner?.name || "N/A"}</p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(exchange.id)}
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

export default AdminExchangesList;
