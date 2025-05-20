import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  //   getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // adjust this import as needed

export const useFirestoreCollection = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colRef = collection(db, collectionName);

  // Realtime listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setDocuments(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching collection:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  });

  // Create
  const addDocument = async (data) => {
    try {
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      console.error("Add document error:", err);
      throw err;
    }
  };

  // Update
  const updateDocument = async (id, updatedData) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedData);
    } catch (err) {
      setError(err.message);
      console.error("Update document error:", err);
      throw err;
    }
  };

  // Delete
  const deleteDocument = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      setError(err.message);
      console.error("Delete document error:", err);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
  };
};
