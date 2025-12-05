"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

interface Bread {
  id: string;
  name: string;
  brand: string;
}

interface ManageBreadsProps {
  params: {
    brand: string;
  };
}

// Helper to normalize brand (remove spaces and uppercase)
const normalizeBrand = (str: string) => str.replace(/\s+/g, "").toUpperCase();

export default function ManageBreads({ params }: ManageBreadsProps) {
  const brandParam = params.brand;
  const [breads, setBreads] = useState<Bread[]>([]);
  const [newBreadName, setNewBreadName] = useState("");

  // Fetch breads filtered by normalized brand
  useEffect(() => {
    const fetchBreads = async () => {
      try {
        const breadsRef = collection(db, "breads");
        const snapshot = await getDocs(breadsRef);

        const breadList: Bread[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            brand: doc.data().brand,
          }))
          .filter(
            (bread) => normalizeBrand(bread.brand) === normalizeBrand(brandParam)
          );

        setBreads(breadList);
      } catch (error) {
        console.error("Error fetching breads:", error);
      }
    };

    fetchBreads();
  }, [brandParam]);

  // Add new bread
  const handleAddBread = async () => {
    const name = newBreadName.trim();
    if (!name) return;

    try {
      // Save brand exactly as passed in params (with proper spacing/casing)
      await addDoc(collection(db, "breads"), {
        name,
        brand: brandParam.toUpperCase(), 
      });

      setNewBreadName("");

      // Refresh list
      const breadsRef = collection(db, "breads");
      const snapshot = await getDocs(breadsRef);

      const breadList: Bread[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          brand: doc.data().brand,
        }))
        .filter(
          (bread) => normalizeBrand(bread.brand) === normalizeBrand(brandParam)
        );

      setBreads(breadList);
    } catch (error) {
      console.error("Error adding bread:", error);
    }
  };

  // Delete bread
  const handleDeleteBread = async (id: string) => {
    try {
      await deleteDoc(doc(db, "breads", id));
      setBreads((prev) => prev.filter((bread) => bread.id !== id));
    } catch (error) {
      console.error("Error deleting bread:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage {brandParam.toUpperCase()} Breads</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newBreadName}
          onChange={(e) => setNewBreadName(e.target.value)}
          placeholder="New bread name"
          className="border border-gray-400 rounded p-2 flex-1"
        />
        <button
          onClick={handleAddBread}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Bread
        </button>
      </div>

      <ul className="space-y-2">
        {breads.length > 0 ? (
          breads.map((bread) => (
            <li
              key={bread.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              {bread.name}
              <button
                onClick={() => handleDeleteBread(bread.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 p-2">No breads yet</li>
        )}
      </ul>
    </div>
  );
}
