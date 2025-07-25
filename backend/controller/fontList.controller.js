import { parse } from "url";
import FontModel from "../model/font.model.js"
import busboy from "busboy";


export function uploadFonts(req, res) {
    if(req.method !== "POST"){
        res.writeHead(405, { "Content-Type": "text/plain" })
        return res.end("Only POST method is allowed.")
    }

    const bb = busboy({headers: req.headers})
    const savePromises = []

    bb.on("file", async (fieldName, file, fileNameObj, encoding, mimetype) => {

        const fileName = fileNameObj.filename || "";
        if(!fileName.endsWith('.ttf')){
            file.resume()
            console.log(`Rejected non-TTF file: ${fileName}`)
            return
        }

        const buffers = []


        file.on('data', (data) => {
            buffers.push(data)
        })

        file.on('end', () => {
            const fontBuffer = Buffer.concat(buffers)

            const newFont = new FontModel({
                fileName,
                fontData: fontBuffer
            })

            const savePromise = newFont.save()
                .catch((error) => {
                    console.error("Error saving font: ",error.message)
                })
            
            savePromises.push(savePromise)
            
        })
    })

    bb.on('finish', async () => {
        try {
            const savedFonts = await Promise.all(savePromises)

            const successfulFonts = savedFonts.filter((font) => font !== null)

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({
                message: "Fonts uploaded successfully",
                fonts: successfulFonts
            }))
        } catch (error) {
            res.writeHead(500, {"Content-Type": "application/json"})
            res.end(JSON.stringify({message: "Error saving fonts", error: error.message}))
        }
    })

    req.pipe(bb)
}

export async function getFonts(req, res) {
    if(req.method !== "GET") {
        res.writeHead(405, {"Content-Type": "text/plain"})
        return res.end("Only GET method is allowed.")
    }

//console.log("GET /fonts hit");

    try {
        //const fonts = await FontModel.find({}, "_id fileName")
        const fonts = await FontModel.find()

console.log("Found fonts:", fonts);

        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({fonts}))
    } catch (error) {
        res.writeHead(500, {"Content-Type": "application/json"})
        res.end(JSON.stringify({
            message: "Error fetching fonts.",
            error: error.message
        }))
    }
}

export async function deleteFont(req, res) {
    if(req.method !== "DELETE"){
        res.writeHead(405, {"Content-Type": "text/plain"})
        return res.end("Only DELETE method is allowed.")
    }

    const parsedUrl = parse(req.url, true)
    const parts = parsedUrl.pathname.split("/")
    const fontId = parts[2]
    
    if(!fontId){
        res.writeHead(400, {"Content-Type": "application/json"})
        return res.end(JSON.stringify({message: "Font ID is required"}))
    }

    try {
        const deletedFont = await FontModel.findByIdAndDelete(fontId)

        if(!deletedFont){
            res.writeHead(404, {"Content-Type": "application/json"})
            return res.end(JSON.stringify({message: "Font not found."}))
        }

        res.writeHead(200, {"Content-Type": "application/json"})
        return res.end(JSON.stringify({message: "Font deleted successfully."}))
    } catch (error) {
        res.writeHead(500, {"Content-Type": "application/json"})
        res.end(JSON.stringify({
            message: "Error deleting font.",
            error: error.message
        }))
    }
}