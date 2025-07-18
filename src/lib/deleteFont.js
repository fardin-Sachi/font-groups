import { useFontStore } from "./store"

export default async (fileId) => {
    const {fetchFonts} = useFontStore()

    try {
        const res = await fetch(`${import.meta.env.VITE_API}/fonts/${fileId}`,{
            method: "DELETE"
        })
        if(res.ok){
            fetchFonts()
        }

    } catch (error) {
        console.error(`Failed to delete. Error: ${error}`)
    }
}