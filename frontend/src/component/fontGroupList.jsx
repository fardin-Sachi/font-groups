import React, { useEffect, useState } from "react";
import { useFontStore } from "../lib/store";

const FontGroupList = () => {
  const {
    fontGroups,
    fonts,
    fetchFontGroups,
    fetchFonts,
    deleteFontGroup,
    editFontGroup,
    fontGroupCreated,
  } = useFontStore();

  const [editingGroupId, setEditingGroupId] = useState(null);
  const [selectedFontIds, setSelectedFontIds] = useState([]);

  useEffect(() => {
    fetchFonts();
    fetchFontGroups();
  }, []);

  useEffect(() => {
    if (fontGroupCreated) {
      fetchFontGroups();
      setEditingGroupId(null);
    }
  }, [fontGroupCreated]);

  useEffect(() => {
    const cleanupInvalidGroups = async () => {
      for (const group of fontGroups) {
        const validFonts = group.fonts?.filter((f) =>
          fonts.some((ff) => ff._id === f._id)
        ) || [];

        if (validFonts.length < 2) {
          await deleteFontGroup(group._id);
        }
      }

      fetchFontGroups();
    };

    if (fonts.length > 0 && fontGroups.length > 0) {
      cleanupInvalidGroups();
    }
  }, [fonts, fontGroups]);


  const handleEditClick = (group) => {
    setEditingGroupId(group._id);
    const currentFontIds = group.fonts
      ?.filter((f) => fonts.some((ff) => ff._id === f._id))
      .map((f) => f._id) || [];
    setSelectedFontIds(currentFontIds);
  };

  const toggleFont = (fontId) => {
    setSelectedFontIds((prev) =>
      prev.includes(fontId)
        ? prev.filter((id) => id !== fontId)
        : [...prev, fontId]
    );
  };

  const handleSaveEdit = async (groupId) => {
    if (selectedFontIds.length < 2) {
      alert("Each group must contain at least 2 fonts.");
      return;
    }

    const originalFontIds =
      fontGroups.find((g) => g._id === groupId)?.fonts
        ?.filter((f) => fonts.some((ff) => ff._id === f._id))
        .map((f) => f._id) || [];

    const add = selectedFontIds.filter((id) => !originalFontIds.includes(id));
    const remove = originalFontIds.filter((id) => !selectedFontIds.includes(id));

    if (add.length || remove.length) {
      await editFontGroup(groupId, { add, remove });
      fetchFontGroups();
    }

    setEditingGroupId(null);
  };

  return (
    <div className="p-6 w-[700px] min-h-[1000px] bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Font Groups</h2>

      {fontGroups.length === 0 ? (
        <p className="text-gray-600">No groups found.</p>
      ) : (
        fontGroups.map((group, idx) => {
          const validFontsInGroup = group.fonts?.filter((font) =>
            fonts.some((f) => f._id === font._id)
          ) || [];

          return (
            <div
              key={group._id}
              className="border p-4 mb-4 rounded-md shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-start flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold">Example {idx + 1}</h3>
                  <p className="text-sm text-gray-700">
                    Fonts:{" "}
                    {validFontsInGroup.length > 0
                      ? validFontsInGroup.map((font) => font.fileName).join(", ")
                      : "None"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Total Fonts: {validFontsInGroup.length}
                  </p>
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleEditClick(group)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFontGroup(group._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingGroupId === group._id && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-medium mb-2">Modify Fonts in Group:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4 max-h-48 overflow-auto">
                    {fonts.map((font) => (
                      <label
                        key={font._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFontIds.includes(font._id)}
                          onChange={() => toggleFont(font._id)}
                        />
                        <span>{font.fileName}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSaveEdit(group._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingGroupId(null)}
                    className="ml-2 px-4 py-1 rounded border border-gray-300 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default FontGroupList;
