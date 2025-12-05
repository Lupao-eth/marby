// app/components/testFirebase.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // correct relative path

export default function TestFirebase() {
  const [places, setPlaces] = useState<string[]>([]);
  const [newPlace, setNewPlace] = useState("");

  // Fetch places from Firestore
  const fetchPlaces = async () => {
    const placesCollection = collection(db, "places"); // your collection name
    const snapshot = await getDocs(placesCollection);
    const placeList: string[] = snapshot.docs.map((doc) => doc.data().name);
    setPlaces(placeList);
  };

  // Add a new place to Firestore
  const addPlace = async () => {
    if (!newPlace.trim()) return;
    const placesCollection = collection(db, "places");
    await addDoc(placesCollection, { name: newPlace });
    setNewPlace("");
    fetchPlaces(); // refresh list
  };

  // Load places on component mount
  useEffect(() => {
  const loadPlaces = async () => {
    await fetchPlaces();
  };
  loadPlaces();
}, []);


  return (
    <div className="p-4 border rounded-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Test Firebase Places</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="New place name"
        />
        <button
          onClick={addPlace}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>

      <ul className="list-disc pl-5">
        {places.map((place, idx) => (
          <li key={idx}>{place}</li>
        ))}
      </ul>
    </div>
  );
}
