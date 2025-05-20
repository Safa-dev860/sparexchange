import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust this path as needed

const useDeleteFromCollection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteDocument = async (collectionName, docId) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (err) {
      setError(err.message || "Error deleting document");
    } finally {
      setLoading(false);
    }
  };

  return { deleteDocument, loading, error };
};

export default useDeleteFromCollection;
