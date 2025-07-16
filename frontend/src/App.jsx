import { useEffect, useState } from "react";
import FontUpload from "./component/fontUpload";
import FontList from "./component/fontList";
import FontGroupCreate from "./component/fontGroupCreate";
import FontGroupList from "./component/fontGroupList";

export default function App() {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);

  const fetchFonts = async () => {
    try {
      const res = await fetch("http://localhost:8000/fonts");
      const data = await res.json();
      if (res.ok) setFonts(data.fonts);
    } catch (err) {
      console.error("Failed to fetch fonts:", err);
    }
  };

  const fetchFontGroups = async () => {
    try {
      const res = await fetch("http://localhost:8000/font-groups");
      const data = await res.json();
      if (res.ok) setFontGroups(data.groups);
    } catch (err) {
      console.error("Failed to fetch font groups:", err);
    }
  };

  useEffect(() => {
    fetchFonts();
    fetchFontGroups();
  }, [fonts, fontGroups]);

  // Trigger refetch after updates
  const handleFontUploaded = () => {
    fetchFonts();
  };

  const handleFontDeleted = () => {
    fetchFonts();
    fetchFontGroups(); // In case a group depends on a deleted font
  };

  const handleGroupCreated = () => {
    fetchFontGroups();
  };

  const handleGroupUpdated = () => {
    fetchFontGroups();
  };

  const handleGroupDeleted = () => {
    fetchFontGroups();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      <h1 className="text-3xl font-bold text-center text-blue-700">Font Manager</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Upload Fonts</h2>
        <FontUpload onUploadSuccess={handleFontUploaded} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Uploaded Fonts</h2>
        <FontList fonts={fonts} onDelete={handleFontDeleted} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Create Font Group</h2>
        <FontGroupCreate fonts={fonts} onGroupCreated={handleGroupCreated} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Font Groups</h2>
        <FontGroupList
          fontGroups={fontGroups}
          fonts={fonts}
          onGroupUpdated={handleGroupUpdated}
          onGroupDeleted={handleGroupDeleted}
        />
      </section>
    </div>
  );
}
