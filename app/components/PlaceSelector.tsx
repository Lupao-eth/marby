"use client";
import React from "react";

interface PlaceSelectorProps {
  places: string[];
  selectedPlace: string;
  setSelectedPlace: (place: string) => void;
}

export default function PlaceSelector({ places, selectedPlace, setSelectedPlace }: PlaceSelectorProps) {
  return (
    <div className="mt-2 mb-4">
      <label className="block mb-1 font-medium">Select Place:</label>
      <select
        value={selectedPlace}
        onChange={(e) => setSelectedPlace(e.target.value)}
        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">-- Choose a place --</option>
        {places.map((place, idx) => (
          <option key={idx} value={place}>
            {place}
          </option>
        ))}
      </select>
    </div>
  );
}
