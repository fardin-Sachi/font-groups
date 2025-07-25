import React, { useState, useEffect } from "react";
import { useFontStore } from "../lib/store";

const FontGroupCreate = () => {
  const { fonts, fetchFonts, createFontGroup, fontGroupCreated } = useFontStore();

  const [selectedFontIds, setSelectedFontIds] = useState([null, null]); // Start with 2 empty slots
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFonts();
  }, []);

  // Clear selections on successful creation
  useEffect(() => {
    if (fontGroupCreated) {
      setSelectedFontIds([null, null]);
      setError("");
    }
  }, [fontGroupCreated]);

  const handleFontChange = (index, fontId) => {
    setSelectedFontIds((prev) => {
      const newSelection = [...prev];
      newSelection[index] = fontId;
      return newSelection;
    });
  };

  const addRow = () => {
    setSelectedFontIds((prev) => [...prev, null]);
  };

  const handleCreate = () => {
    // Remove nulls and duplicates
    const filteredIds = selectedFontIds.filter((id) => id !== null);
    const uniqueIds = [...new Set(filteredIds)];

    if (uniqueIds.length < 2) {
      setError("Please select at least 2 unique fonts to create a group.");
      return;
    }

    createFontGroup(uniqueIds);
  };

  return (
    <div className="p-6 w-[500px] bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Font Group</h2>

      {selectedFontIds.map((selectedId, index) => (
        <div key={index} className="mb-3">
          <select
            value={selectedId || ""}
            onChange={(e) => handleFontChange(index, e.target.value || null)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a font</option>
            {fonts.map((font) => (
              <option key={font._id} value={font._id}>
                {font.fileName}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Row
      </button>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <button
        onClick={handleCreate}
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
};

export default FontGroupCreate;
