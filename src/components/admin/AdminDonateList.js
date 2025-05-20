import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

const AdminDoneList = () => {
  const { documents, loading, error, deleteDocument } =
    useFirestoreCollection("Done");

  const handleDelete = async (id) => {
    await deleteDocument(id);
  };

  if (loading) return <div className="p-4">Loading completed tasks...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="py-6">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {documents.map((task) => (
          <div
            key={task.id}
            className="min-w-[300px] flex-shrink-0 bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden relative"
          >
            {/* Proof Image */}
            <img
              src={task.proofImages?.[0]}
              alt="Proof"
              className="w-full h-48 object-cover"
            />

            {/* Task Details */}
            <div className="p-4 pb-14">
              <h3 className="text-lg font-semibold mb-1">{task.doneTitle}</h3>
              <p className="text-sm text-gray-500 mb-1">
                Remarks: {task.remarks}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Completion Date:{" "}
                <span className="font-medium">
                  {new Date(task.completionDate).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm mb-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    task.status === "inprogress"
                      ? "text-yellow-600"
                      : task.status === "completed"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {task.status}
                </span>
              </p>
              <div className="text-xs text-gray-500 mt-2">
                <p>Owner: {task.owner?.name || "N/A"}</p>
                <p>Email: {task.owner?.email}</p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(task.id)}
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

export default AdminDoneList;
