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
    },
    
    fontGroups: [],
    fontGroupCreated: false,
    setFontGroupCreated: (val) => set({
        fontGroupCreated: val
    }),

    fetchFontGroups: async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/font-groups`)
            const data = await res.json()
            if(res.ok){
                set(() => ({fontGroups: data.fontGroups}))
                get().setFontGroupCreated(false)
            }
        } catch (error) {
            console.error(`Failed fetching Font Groups. Error: ${error}`)
        }
    },
    createFontGroup: async (fontIds) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/create-font-group`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fonts: fontIds})
            })
            if(res.ok){
                get().setFontGroupCreated(true)
            }
        } catch (error) {
            console.error(`Failed creating Font Group. Error: ${error}`)
        }
    },
    editFontGroup: async (fontGroupId, {add=[], remove=[]}) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/font-group/${fontGroupId}`,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({add, remove})
            })
            // const data = await res.json()
            if(res.ok){
                get().setFontGroupCreated(true)
                //get().fetchFontGroups()
            }
        } catch (error) {
            console.error(`Failed to delete. Error: ${error}`)
        }
    },
    deleteFontGroup: async (groupId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API}/font-group/${groupId}`, {
                method: "DELETE",
            })
            // await res.json()
            if(res.ok){
                get().fetchFontGroups()
                get().setFontGroupCreated(true)
            }
        } catch (error) {
            console.error(`Failed to delete Font Group. Error: ${error}`)
        }
    },
}))