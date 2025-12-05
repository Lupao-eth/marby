// components/EditableTitle.tsx
"use client";
import React, { useState } from "react";

interface EditableTitleProps {
  title: string;
  setTitle: (title: string) => void;
}

export default function EditableTitle({ title, setTitle }: EditableTitleProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center justify-center mb-2">
      {editing ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-400 p-1 rounded w-56 text-center"
            placeholder="Enter title or leave blank"
          />
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1 text-black underline"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-center">{title}</h2>
          <button
            onClick={() => setEditing(true)}
            className="px-2 text-black underline"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
