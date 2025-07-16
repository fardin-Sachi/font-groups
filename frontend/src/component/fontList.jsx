import { useEffect, useState } from "react";

export default function FontList() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch uploaded fonts
  const fetchFonts = async () => {
    try {
      const res = await fetch("http://localhost:8000/fonts");
      const data = await res.json();
      if (res.ok) setFonts(data.fonts);
    } catch (err) {
      console.error("Error fetching fonts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  // Load font into browser from backend
  const loadFont = async (fontId, fileName) => {
    try {
      const res = await fetch(`http://localhost:8000/fonts/${fontId}`);
      const buffer = await res.arrayBuffer();
      const font = new FontFace(fileName, buffer);
      await font.load();
      document.fonts.add(font);
    } catch (err) {
      console.error(`Failed to load font ${fileName}`, err);
    }
  };

  // Load all fonts on mount
  useEffect(() => {
    fonts.forEach(font => {
      loadFont(font._id, font.fileName);
    });
  }, [fonts]);

  // Delete font
  const deleteFont = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/fonts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFonts(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error("Error deleting font:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading fonts...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Uploaded Fonts</h2>

      {fonts.length === 0 ? (
        <p className="text-gray-600">No fonts uploaded yet.</p>
      ) : (
        <ul className="space-y-6">
          {fonts.map((font, i) => (
            <li
              key={font._id}
              className="p-4 border rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">{font.fileName}</p>
                <p style={{ fontFamily: font.fileName }} className="text-lg">
                  Example Style
                </p>
              </div>

              <button
                onClick={() => deleteFont(font._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
