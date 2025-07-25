import { useState } from 'react'
// import useFontStore from "../lib/store.js"
import { useFontStore } from '../lib/store'

const FontUpload = () => {
    const [error, setError] = useState("")
    const [file, setFile] = useState()
    // const fileUploaded = useFontStore().fileUploaded
    const uploadFont = useFontStore().uploadFont

    const handleUpload = (uploadedFile) => {
        // console.log(uploadedFile)
        setFile(uploadedFile)
        
        if(uploadedFile && uploadedFile.name.toLowerCase().endsWith(".ttf")){
            const formData = new FormData()
            formData.append('font', uploadedFile)
            uploadFont(formData)
            setError("")
        } else {
            setError("Only TTF File Allowed")
        }
    }
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0]
        handleUpload(uploadedFile)
    }
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const droppedFile = e.dataTransfer.files[0]
        handleUpload(droppedFile)
    }
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
  return (
    <div className='flex flex-col items-center justify-center'>
        <h2 className='text-black font-bold text-3xl mb-4'>Upload Fonts</h2>

        <label
            htmlFor='ttfinput'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className='flex flex-col items-center justify-center bg-amber-400 h-[200px] w-[500px] cursor-pointer border-2 border-dashed'
        >
            
            <p className=''>Click to upload or drag and drop</p>
            {file && error===""? 
            <p className={`text-green-700`}>Uploaded: {file.name}</p> 
            : 
            <p className={`text-red-600`}>{error}</p> 
            }
        </label>
{/* {console.log("file", file)} */}

        <input
            id='ttfinput'
            className=''
            type='file'
            accept='.ttf'
            onChange={handleFileChange}
            hidden
        />
    </div>
  )
}

export default FontUpload