import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

const AdminProductsList = () => {
  const {
    documents,
    loading,
    error,

    deleteDocument,
  } = useFirestoreCollection("Products");

  const handleDelete = async (id) => {
    await deleteDocument(id);
  };

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="py-6">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {documents.map((product) => (
          <div
            key={product.id}
            className="min-w-[300px] flex-shrink-0 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden relative"
          >
            {/* Product Image */}
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            {/* Product Details */}
            <div className="p-4 pb-12">
              {" "}
              {/* Extra padding for button space */}
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-1">Category: {product.category}</p>
              <p className="text-green-700 font-medium mb-1">
                ${product.price}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                {product.description}
              </p>
              <div className="text-xs text-gray-500">
                <p>Location: {product.location?.city}</p>
                <p>Owner: {product.owner?.name || "N/A"}</p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(product.id)}
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

export default AdminProductsList;
