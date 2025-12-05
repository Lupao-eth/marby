"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

interface Bread {
  id: string; // Firestore doc ID
  name: string;
}

export default function ManageBreads() {
  const [brand, setBrand] = useState("MARBY");
  const [breads, setBreads] = useState<Bread[]>([]);
  const [newBread, setNewBread] = useState("");

  // Fetch breads for selected brand
  const fetchBreads = async (selectedBrand: string) => {
    const breadsRef = collection(db, selectedBrand.toLowerCase());
    const snapshot = await getDocs(breadsRef);
    const list: Bread[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setBreads(list);
  };

  // useEffect: wrap async calls in inner function
  useEffect(() => {
    const loadBreads = async () => {
      await fetchBreads(brand);
    };
    loadBreads();
  }, [brand]);

  // Add bread
  const handleAddBread = async () => {
    if (!newBread.trim()) return;
    try {
      const docRef = await addDoc(collection(db, brand.toLowerCase()), {
        name: newBread.trim(),
        beginning: "",
        delivery: "",
        ending: "",
        offtake: "",
      });
      setBreads((prev) => [...prev, { id: docRef.id, name: newBread.trim() }]);
      setNewBread("");
    } catch (error) {
      console.error("Error adding bread:", error);
    }
  };

  // Delete bread
  const handleDeleteBread = async (id: string) => {
    try {
      await deleteDoc(doc(db, brand.toLowerCase(), id));
      setBreads((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting bread:", error);
    }
  };

  return (
    <div className="p-4">
      <Navbar />

      <h1 className="text-2xl font-bold mb-4">Manage Breads</h1>

      {/* Add Bread */}
      <div className="flex gap-2 mb-4">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="MARBY">Marby</option>
          <option value="GARDENIA">Gardenia</option>
          <option value="VALLEY BREAD">Valley Bread</option>
        </select>

        <input
          value={newBread}
          onChange={(e) => setNewBread(e.target.value)}
          className="border border-gray-400 p-2 rounded flex-1"
          placeholder="Add new bread..."
        />

        <button
          onClick={handleAddBread}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      <h2 className="font-semibold mb-2">Current Breads</h2>

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
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500 p-2 border rounded text-center">
            No breads for {brand}
          </li>
        )}
      </ul>
    </div>
  );
}
