import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

const AdminFreelanceList = () => {
  const { documents, loading, error, deleteDocument } =
    useFirestoreCollection("Freelance");

  const handleDelete = async (id) => {
    await deleteDocument(id);
  };

  if (loading) return <div className="p-4">Loading freelance gigs...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="py-6">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {documents.map((gig) => (
          <div
            key={gig.id}
            className="min-w-[300px] flex-shrink-0 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden relative"
          >
            {/* Gig Image */}
            <img
              src={gig.images?.[0]}
              alt="Gig"
              className="w-full h-48 object-cover"
            />

            {/* Gig Details */}
            <div className="p-4 pb-14">
              <h3 className="text-lg font-semibold mb-1">{gig.gigTitle}</h3>
              <p className="text-sm text-gray-500 mb-1">
                Category: {gig.category}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Description: {gig.description}
              </p>
              <p className="text-sm mb-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    gig.status === "active" ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {gig.status}
                </span>
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mt-2">
                {gig.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Freelancer Info */}
              <div className="text-xs text-gray-500 mt-3">
                <p>Freelancer: {gig.freelancer?.name || "N/A"}</p>
                <p>Email: {gig.freelancer?.email}</p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(gig.id)}
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

export default AdminFreelanceList;
