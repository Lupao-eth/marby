"use client";

import React from "react";
import { BreadRow } from "../types";

interface TableSectionProps {
  sectionTitle: string;
  rows: BreadRow[];
  handleChange: (index: number, field: keyof Omit<BreadRow, "id" | "brand">, value: string) => void;
  handleDelete: (index: number) => void;
  headerBg?: string;
  headerTextColor?: string;
}

export default function TableSection({
  sectionTitle,
  rows,
  handleChange,
  handleDelete,
  headerBg,
  headerTextColor,
}: TableSectionProps) {
  return (
    <div className="mb-6 w-full overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-400 text-sm md:text-base table-fixed">
        <thead>
          <tr>
            {/* Only brand/title column */}
            <th
              className="border border-gray-400 p-2 text-left"
              style={{ background: headerBg || "#F3F4F6", color: headerTextColor || "#000" }}
            >
              {sectionTitle}
            </th>
            <th className="border border-gray-400 p-2 text-center w-1/5">DELIVERY</th>
            <th className="border border-gray-400 p-2 text-center w-1/5">OFFTAKE</th>
            <th className="border border-gray-400 p-2 text-center w-1/5">OFFTAKE %</th>
            <th className="border border-gray-400 p-2 text-center w-1/5">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {/* Brand/Name */}
              <td className="border border-gray-400 p-2">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </td>

              {/* Delivery */}
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  value={row.delivery === 0 ? "" : row.delivery}
                  placeholder="0"
                  onChange={(e) => handleChange(idx, "delivery", e.target.value)}
                  className={`border border-gray-300 p-2 w-full text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    row.delivery === 0 ? "opacity-50" : "opacity-100"
                  }`}
                />
              </td>

              {/* Offtake */}
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  value={row.offtake === 0 ? "" : row.offtake}
                  placeholder="0"
                  onChange={(e) => handleChange(idx, "offtake", e.target.value)}
                  className={`border border-gray-300 p-2 w-full text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    row.offtake === 0 ? "opacity-50" : "opacity-100"
                  }`}
                />
              </td>

              {/* Offtake % */}
              <td className="border border-gray-400 p-2">
                <input
                  type="text"
                  value={row.offtakePercent === 0 ? "" : `${row.offtakePercent}%`}
                  placeholder="0%"
                  onChange={(e) => {
                    const val = e.target.value.replace("%", "");
                    handleChange(idx, "offtakePercent", val);
                  }}
                  className={`border border-gray-300 p-2 w-full text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    row.offtakePercent === 0 ? "opacity-50" : "opacity-100"
                  }`}
                />
              </td>

              {/* Actions */}
              <td className="border border-gray-400 p-2 text-center">
                <button
                  onClick={() => handleDelete(idx)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
