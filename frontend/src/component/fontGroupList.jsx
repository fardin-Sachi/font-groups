import { useState } from "react";

export default function FontGroupList({ fontGroups=[], fonts=[], onGroupUpdated, onGroupDeleted }) {
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editSelectedFonts, setEditSelectedFonts] = useState([]);

  const startEditing = (group) => {
    setEditingGroupId(group._id);
    setEditSelectedFonts(group.fonts.map((font) => font._id));
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditSelectedFonts([]);
  };

  const toggleFontSelection = (fontId) => {
    if (editSelectedFonts.includes(fontId)) {
      setEditSelectedFonts(editSelectedFonts.filter((id) => id !== fontId));
    } else {
      setEditSelectedFonts([...editSelectedFonts, fontId]);
    }
  };

  const saveChanges = async () => {
    if (editSelectedFonts.length < 2) {
      alert("A font group must contain at least 2 fonts.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/font-group/${editingGroupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          add: editSelectedFonts,  // we send full new list to simplify server update logic
          remove: [], // server-side you can handle update by replacing fonts array entirely if desired
        }),
      });

      if (res.ok) {
        onGroupUpdated?.();
        cancelEditing();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update font group.");
      }
    } catch (error) {
      alert(`Network error updating font group. Error: ${error}`);
    }
  };

  const deleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this font group?")) return;

    try {
      const res = await fetch(`http://localhost:8000/font-group/${groupId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onGroupDeleted?.();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete font group.");
      }
    } catch (error) {
      alert("Network error deleting font group.");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Font Groups</h2>
      {!(fontGroups?.length) && <p>No font groups found.</p>}


      <div className="space-y-6">
        {fontGroups.map((group, index) => {
          const isEditing = editingGroupId === group._id;

          return (
            <div key={group._id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Example {index + 1}</h3>

                {isEditing ? (
                  <div className="space-x-2">
                    <button
                      onClick={saveChanges}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => startEditing(group)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGroup(group._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="mb-1">
                Number of fonts: <strong>{Array.isArray(group.fonts) ? group.fonts.length : 0}</strong>
              </p>


              {isEditing ? (
                <div className="flex flex-wrap gap-2 max-w-xl">
                  {fonts.map((font) => {
                    const selected = editSelectedFonts.includes(font._id);
                    return (
                      <button
                        key={font._id}
                        onClick={() => toggleFontSelection(font._id)}
                        className={`px-3 py-1 border rounded text-sm ${
                          selected ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                      >
                        {font.fileName}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <ul className="list-disc list-inside max-w-xl">
                  {(group.fonts || []).map((font, i) => (
                    <li key={font._id || i} style={{ fontFamily: font.fileName || "sans-serif" }}>
                      {font.fileName || "Unknown Font"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
