import React, { useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function FontUpload({ onUploadSuccess }) {
  const dropRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("font", file);

    try {
      const res = await fetch("http://localhost:8000/upload-fonts", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Uploaded: ${file.name}`);
        setError("");
        setFileName("");
        onUploadSuccess?.(); // trigger parent refresh
      } else {
        setError(data.message || "Upload failed.");
        setMessage("");
      }
    } catch (err) {
      setError(`Error uploading font. Error: ${err}`);
      setMessage("");
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (
      file.name.toLowerCase().endsWith(".ttf") ||
      file.type === "font/ttf" ||
      file.type === "application/x-font-ttf"
    ) {
      setFileName(file.name);
      uploadFile(file);
    } else {
      setError("Only TTF font files are allowed.");
      setMessage("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
    dropRef.current?.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current?.classList.add("border-blue-400", "bg-blue-50");
  };

  const handleDragLeave = () => {
    dropRef.current?.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const triggerFileInput = () => {
    document.getElementById("ttf-file-input").click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
        className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center cursor-pointer transition-all"
      >
        <input
          type="file"
          id="ttf-file-input"
          accept=".ttf"
          onChange={handleFileInput}
          className="hidden"
        />
        <IoCloudUploadOutline className="mx-auto size-10 text-gray-600 mb-2" />
        <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
        <p className="text-sm text-gray-500">Only TTF font files are accepted</p>

        {fileName && <p className="text-green-600 mt-2">Selected: {fileName}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
}
