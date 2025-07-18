import { create } from "zustand";

export const useFontStore = create((set, get) => ({
    // TODO: LOADING state
    fileUploaded: false,
    setFileUploaded: (val) => set({
        fileUploaded: val
    }),

    fonts: [],
    fetchFonts: async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/fonts`)
            const data = await res.json()
            if(res.ok) {
                set(() => ({fonts: data.fonts}))
                get().setFileUploaded(false)
            }
            } catch (error) {
                console.error(`Error fetching fonts. Error: ${error}`)
        }
    },
    uploadFont: async (formData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/upload-fonts`, {
                method: "POST",
                body: formData,
            })
            //const data = await res.json()
            if(!res.ok){
                console.error("Failed to upload the font.")
            } else {
                get().setFileUploaded(true)
            }
        } catch (error) {
            console.error(`Error uploading the font. Error: ${error}`)
        }
    },

    deleteFont: async (fileId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/fonts/${fileId}`,{
                method: "DELETE"
            })
            if(res.ok){
                get().fetchFonts()
            }

        } catch (error) {
            console.error(`Failed to delete. Error: ${error}`)
        }
    }
}))