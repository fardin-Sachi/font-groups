/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5"

export default function FontUpload() {
    const [fileName, setFileName] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const dropRef = useRef()

    const uploadFile = async (file) => {
      const formData = new FormData()
      formData.append("font", file)

      try {
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if(res.ok) {
          setMessage(`Uploaded: ${file.name}`)
          setError("")
        } else {
          setError(data.error || "Upload failed")
          setMessage("")
        }
      } catch (error) {
        setError("Error uploading file.")
      }
    }

    const handleFile = (file) => {
      if(file && (file.name.toLowerCase().endsWith(".ttf")  || file.type === "font/ttf")){
        setFileName(file.name)
        // uploadFile(file)
      } else {
        setError("Only TTF files are valid.")
        setMessage("")
      }
      // TODO: Use the file for further tasks

    }

    const handleDrop = (e) => {
      e.preventDefault()
      // e.stopPropagation()

      const file = e.dataTransfer.files[0]
      handleFile(file)
      dropRef.current.classList.remove("border-blue-400", "bg-blue-50")
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      dropRef.current.classList.add("border-blue-400", "bg-blue-50")
    }

    const handleDragLeave = () => {
      dropRef.current.classList.remove("border-blue-400", "bg-blue-50")
    }

    const handleFileInput = (e) => {
      const file = e.target.files[0]
      handleFile(file)
    }

    const triggerFileInput = () => {
      document.getElementById("ttf-file-input").click()
    }


  return (
      <div 
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
        className="w-full max-w-md mx-auto p-6 text-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-100"
      >
          <input 
              id="ttf-file-input"
              type="file"
              accept=".ttf"
              onChange={handleFileInput}
              className="hidden"
          />
          <IoCloudUploadOutline className="place-self-center size-8 text-gray-600"/>
          <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
          <p className="text-gray-600 text-sm">Only TTF File Allowed</p>

          {fileName && (
              <p className="text-green-500">Selected: {fileName}</p>
          )}
          {error && (
              <p className="text-red-500">Oops... {error}</p>
          )}
      </div>
  );
}
