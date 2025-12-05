"use client";

import React, { useState, useEffect } from "react";
import EditableTitle from "./EditableTitle";
import TableSection from "./TableSection";
import { exportToPDF } from "../utils/exportUtils";
import { exportToExcel } from "../utils/exportExcel";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { BreadRow } from "../types";

interface TableSet {
  place: string;
  marbyRows: BreadRow[];
  gardeniaRows: BreadRow[];
  valleyRows: BreadRow[];
}

export default function DataTable() {
  const [title, setTitle] = useState("WEEKLY OFFTAKE");
  const [tableSets, setTableSets] = useState<TableSet[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [showPlaceSelector, setShowPlaceSelector] = useState(false);

  // Fetch places on client mount only
  useEffect(() => {
    async function fetchPlaces() {
      const snap = await getDocs(collection(db, "places"));
      setPlaces(snap.docs.map((d) => d.data().name as string));
    }
    fetchPlaces();
  }, []);

  // Fetch breads for a brand
  const fetchBreadsForBrand = async (collectionName: string, brandLabel: string) => {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: crypto.randomUUID(), // generate only on client
        brand: brandLabel,
        name: data.name as string,
        delivery: 0,
        offtake: 0,
        offtakePercent: 0,
      };
    });
  };

  // Add a new place set
  const handlePlaceClick = async (place: string) => {
    const [marbyRows, gardeniaRows, valleyRows] = await Promise.all([
      fetchBreadsForBrand("marby", "MARBY"),
      fetchBreadsForBrand("gardenia", "GARDENIA"),
      fetchBreadsForBrand("valleybread", "VALLEY BREAD"),
    ]);

    const newSet: TableSet = { place, marbyRows, gardeniaRows, valleyRows };
    setTableSets((prev) => [...prev, newSet]);
    setShowPlaceSelector(false);
  };

  // Update bread values
  const handleChange = (
    setIndex: number,
    brand: "marbyRows" | "gardeniaRows" | "valleyRows",
    rowIndex: number,
    field: keyof Omit<BreadRow, "id" | "brand">,
    value: string
  ) => {
    setTableSets((prev) => {
      const newSets = [...prev];
      const row = newSets[setIndex][brand][rowIndex];
      if (field === "name") row.name = value;
      else if (field === "delivery") row.delivery = Number(value);
      else if (field === "offtake") row.offtake = Number(value);
      else if (field === "offtakePercent") row.offtakePercent = Number(value);
      return newSets;
    });
  };

  // Add a new bread row
  const handleAddBread = (
    setIndex: number,
    brand: "marbyRows" | "gardeniaRows" | "valleyRows"
  ) => {
    const name = prompt("Enter new bread name:");
    if (!name) return;

    setTableSets((prev) => {
      const newSets = [...prev];
      const newRow: BreadRow = {
        id: crypto.randomUUID(),
        brand:
          brand === "marbyRows"
            ? "MARBY"
            : brand === "gardeniaRows"
            ? "GARDENIA"
            : "VALLEY BREAD",
        name,
        delivery: 0,
        offtake: 0,
        offtakePercent: 0,
      };
      newSets[setIndex][brand].push(newRow);
      return newSets;
    });
  };

  // Delete a bread row
  const handleDeleteBread = (
    setIndex: number,
    brand: "marbyRows" | "gardeniaRows" | "valleyRows",
    rowIndex: number
  ) => {
    setTableSets((prev) => {
      const newSets = [...prev];
      newSets[setIndex][brand].splice(rowIndex, 1);
      return newSets;
    });
  };

  // Export PDF
  const handleExportPDF = () => {
    const allSections = tableSets.flatMap((set) => [
      { section: "MARBY", place: set.place, rows: set.marbyRows },
      { section: "GARDENIA", place: set.place, rows: set.gardeniaRows },
      { section: "VALLEY BREAD", place: set.place, rows: set.valleyRows },
    ]);
    exportToPDF(allSections, title);
  };

  return (
    <div className="p-4 space-y-6 relative">
      {/* Editable title */}
      {title && (
        <div className="w-full bg-yellow-300 rounded-md px-2 py-1 flex justify-center font-bold">
          <EditableTitle title={title} setTitle={(t) => setTitle(t.toUpperCase())} />
        </div>
      )}

      {/* Add Set Button */}
      <button
        onClick={() => setShowPlaceSelector(true)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Add Set
      </button>

      {/* Place Selector Modal */}
      {showPlaceSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select a Place</h2>
              <button
                onClick={() => setShowPlaceSelector(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {places.map((place) => (
                <div
                  key={place}
                  className="cursor-pointer bg-gray-100 p-4 rounded shadow hover:bg-gray-200 text-center font-semibold transition"
                  onClick={() => handlePlaceClick(place)}
                >
                  {place}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table Sets */}
      {tableSets.map((set, setIndex) => (
        <div key={setIndex} className="mt-4 border p-4 rounded space-y-4">
          <h3 className="text-red-600 font-bold">{set.place}</h3>

          {([
            { brand: "marbyRows", name: "MARBY" },
            { brand: "gardeniaRows", name: "GARDENIA" },
            { brand: "valleyRows", name: "VALLEY BREAD" },
          ] as const).map((section) => (
            <div key={section.brand}>
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => handleAddBread(setIndex, section.brand)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Add Bread
                </button>
              </div>
              <TableSection
                sectionTitle={section.name}
                rows={set[section.brand]}
                handleChange={(i, f, v) => handleChange(setIndex, section.brand, i, f, v)}
                handleDelete={(i) => handleDeleteBread(setIndex, section.brand, i)}
                headerBg={
                  section.name === "MARBY"
                    ? "linear-gradient(90deg, #F87171, #DC2626)"
                    : section.name === "GARDENIA"
                    ? "linear-gradient(90deg, #BBF7D0, #4ADE80)"
                    : "linear-gradient(90deg, #FEF08A, #FACC15)"
                }
                headerTextColor="#000000"
              />
            </div>
          ))}
        </div>
      ))}

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition"
          onClick={async () => {
            await exportToExcel(
              tableSets.flatMap((set) => [
                { section: "MARBY", place: set.place, rows: set.marbyRows },
                { section: "GARDENIA", place: set.place, rows: set.gardeniaRows },
                { section: "VALLEY BREAD", place: set.place, rows: set.valleyRows },
              ])
            );
          }}
        >
          Export to Excel
        </button>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}
