import { useEffect } from 'react'
import { useFontStore } from '../lib/store'
import bufferToBase64 from '../lib/bufferToBase64.js'

const FontList = () => {
  const { fetchFonts, fileUploaded, fonts, deleteFont } = useFontStore()

  useEffect(() => {
    fetchFonts()
  }, [])

  useEffect(() => {
    if (fileUploaded) fetchFonts()
  })

  useEffect(() => {
    fonts.forEach((font) => {
      //const base64 = font.fontData?.$binary?.base64
      const bufferData = font.fontData?.data
      //console.log("fawf", base64)
      if (!bufferData) return

      const base64 = bufferToBase64(bufferData)

      const safeFontName = font.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

      const fontUrl = `data:font/ttf;base64,${base64}`
//console.log("fontUrl ", fontUrl)
      const style = document.createElement('style')
      style.id = safeFontName
      style.innerHTML = `
        @font-face {
          font-family: '${safeFontName}';
          src: url('${fontUrl}') format('truetype');
          font-display: swap;
        }
      `
      document.head.appendChild(style)

    })
  }, [fonts])

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-black font-bold text-3xl mb-4'>Font List</h2>
      
      {fonts.length === 0 ? (
        <p>No fonts uploaded yet.</p>
      ) : (
        fonts.map((font, i) => {
          const safeFontName = font.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')

          return (
            <div key={i} className='flex items-center gap-4 mb-4'>
              <p className='w-60 font-medium text-sm truncate'>{font.fileName}</p>
              <p
                className='text-xl'
                style={{ fontFamily: safeFontName }}
              >
                Example Style
              </p>
              <button
                onClick={() => deleteFont(font._id)}
                className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}

export default FontList
