const ExchangeDetails = ({ exchange, onToggleFavorite, isOwner }) => {
  return (
    <div className="w-full md:w-1/3 flex flex-col space-y-4">
      <div className="w-full">
        {exchange.images?.length > 0 ? (
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-64 md:max-h-[calc(100vh-10rem)]">
            {exchange.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={exchange.itemOffered}
                className="w-full h-48 object-cover rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images available.</p>
        )}
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          {exchange.itemOffered}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Wants: {exchange.itemWanted}
        </p>
        <p className="text-gray-600 mb-4">{exchange.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Condition:</span> {exchange.condition}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Location:</span>{" "}
          {exchange.location?.city || exchange.location}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Owner:</span> {exchange.owner?.name} (
          {exchange.owner?.email})
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">Status:</span> {exchange.status}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold">Created:</span>{" "}
          {new Date(exchange.createdAt).toLocaleDateString()}
        </p>
        {!isOwner && (
          <button
            onClick={onToggleFavorite}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-2xl"
            aria-label="Toggle Favorite"
          >
            ❤️
          </button>
        )}
      </div>
    </div>
  );
};

export default ExchangeDetails;
