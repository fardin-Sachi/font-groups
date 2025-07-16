import { useState } from "react";

export default function FontGroupCreate({ fonts, onGroupCreated }) {
  const [selectedFonts, setSelectedFonts] = useState(["", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFontChange = (index, value) => {
    const updated = [...selectedFonts];
    updated[index] = value;
    setSelectedFonts(updated);
  };

  const addRow = () => {
    setSelectedFonts([...selectedFonts, ""]);
  };

  const removeRow = (index) => {
    if (selectedFonts.length > 2) {
      const updated = [...selectedFonts];
      updated.splice(index, 1);
      setSelectedFonts(updated);
    }
  };

  const createGroup = async () => {
    const fontIds = selectedFonts.filter((id) => id);
    if (fontIds.length < 2) {
      setError("At least 2 fonts are required to create a group.");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/create-font-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fonts: fontIds }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Font group created successfully.");
        setError("");
        setSelectedFonts(["", ""]);
        if (onGroupCreated) onGroupCreated();
      } else {
        setError(data.message || "Failed to create font group.");
        setSuccess("");
      }
    } catch (err) {
      setError(`Network error. Error: ${err}`);
      setSuccess("");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Create Font Group</h2>

      <div className="space-y-4">
        {selectedFonts.map((fontId, index) => (
          <div key={index} className="flex gap-2 items-center">
            <select
              value={fontId}
              onChange={(e) => handleFontChange(index, e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded"
            >
              <option value="">-- Select Font --</option>
              {fonts.map((font) => (
                <option key={font._id} value={font._id}>
                  {font.fileName}
                </option>
              ))}
            </select>

            {selectedFonts.length > 2 && (
              <button
                onClick={() => removeRow(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addRow}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          + Add Row
        </button>

        <button
          onClick={createGroup}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Group
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </div>
    </div>
  );
}
