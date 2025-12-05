"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useFirebaseData, Place } from "../hooks/useFirebaseData";

export default function ManagePlaces() {
  const { places, setPlaces } = useFirebaseData(); // places is now Place[]
  const [newPlace, setNewPlace] = useState("");

  // Add new place
  const addPlace = async () => {
    if (!newPlace.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "places"), { name: newPlace });
      // update local state immediately
      setPlaces([...places, { id: docRef.id, name: newPlace }]);
      setNewPlace("");
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  // Delete place
  const removePlace = async (id: string) => {
    try {
      await deleteDoc(doc(db, "places", id));
      // remove from local state
      setPlaces(places.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  return (
    <div className="p-4">
      <Navbar />

      <h1 className="text-2xl font-bold mb-4">Manage Places</h1>

      {/* Add new place */}
      <div className="flex gap-2 mb-4">
        <input
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
          className="border border-gray-400 p-2 rounded"
          placeholder="Add new place..."
        />
        <button
          onClick={addPlace}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      {/* Places list */}
      <ul>
        {places.map((place: Place) => (
          <li
            key={place.id}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            {place.name}
            <button
              onClick={() => removePlace(place.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
