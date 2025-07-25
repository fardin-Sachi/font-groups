import FontGroupModel from "../model/fontGroup.model.js"
import {parse} from "url"

export async function createFontGroup(req, res) {
    if(req.method !== "POST"){
        res.writeHead(405, {"Content-Type": "text/plain"})
        return res.end("Only POST method is allowed")
    }

    let body = ""

    req.on("data", (chunk) => {
        body += chunk
    })

    req.on("end", async () => {
        try {
            const data = JSON.parse(body)

            if(!data.fonts || !Array.isArray(data.fonts)){
                res.writeHead(400, {"Content-Type": "application/json"})
                return res.end(JSON.stringify({message: "Fonts must be an array of font IDs."}))
            }

            if(data.fonts.length <2 ){
                res.writeHead(400, {"Content-Type": "application/json"})
                return res.end(JSON.stringify({message: "At least 2 font IDs are required to create a group."}))
            }

            const newGroup = new FontGroupModel({fonts: data.fonts})
            const savedGroup = await newGroup.save()

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify({
                message: "Font group created successfully.",
                fontGroupId: savedGroup._id
            }))
        } catch (error) {
            res.writeHead(500, {"Content-Type":"application/json"})
            res.end(JSON.stringify({
                message: "Invalid JSON or server error.",
                error: error.message
            }))
        }
    })

    req.on("error", (error) => {
        res.writeHead(500, {"Content-Type": "application/json"})
        res.end(JSON.stringify({
            message: "Request error.",
            error: error.message
        }))
    })
}

export async function getFontGroups(req, res) {
    if(req.method !== "GET"){
        res.writeHead(405, {"Content-Type": "text/plain"})
        return res.end("Only GET method is allowed.")
    }

    try {
        const groups = await FontGroupModel.find()
            .populate("fonts", "_id fileName")
            .exec()

        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({fontGroups: groups}))
    } catch (error) {
        res.writeHead(500, {"Content-Type": "application/json"})
        res.end(
            JSON.stringify({
                message: "Error fetching font groups.",
                error: error.message
            })
        )
    }
}

export async function deleteFontGroup(req, res) {
    if(req.method !== "DELETE"){
        res.writeHead(405, {"Content-Type": "text/plain"})
        return res.end("Only DELETE method is allowed.")
    }

    const parsedUrl = parse(req.url, true)
    const parts = parsedUrl.pathname.split("/")
    const groupId = parts[2]

    if(!groupId){
        res.writeHead(400, {"Content-Type": "application/json"})
        return res.end(JSON.stringify({message: "Font group ID is required."}))
    }

    try {
        const deletedGroup = await FontGroupModel.findByIdAndDelete(groupId)

        if(!deletedGroup){
            res.writeHead(404, {"Content-Type": "application/json"})
            return res.end(JSON.stringify({message: "Font group not found."}))
        }

        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({message: "Font group deleted successfully."}))
    } catch (error) {
        res.writeHead(500, {"Content-Type": "application/json"})
        return res.end(JSON.stringify({
            message: "Error deleting font group.",
            error: error.message
        }))
    }
}

export async function updateFontGroup(req, res) {
    if(req.method !== "PATCH"){
        res.writeHead(405, {"Content-Type": "text/plain"})
        return res.end("Only PATCH method is allowed.")
    }

    const parsedUrl = parse(req.url, true)
    const parts = parsedUrl.pathname.split("/")
    const groupId = parts[2]

    if(!groupId){
        res.writeHead(400, {"Content-Type": "application/json"})
        return res.end(JSON.stringify({message: "Font group ID is required"}))
    }

    let body = ""

    req.on("data", (chunk) => {
        body += chunk
    })

    req.on("end", async () => {
        try {
            const {add = [], remove=[]} = JSON.parse(body)

            const group = await FontGroupModel.findById(groupId)
            if(!group){
                res.writeHead(404, {"Content-Type": "application/json"})
                return res.end(JSON.stringify({message: "Font group not found."}))
            }

            const currentFonts = group.fonts.map((id) => id.toString())

            add.forEach((fontId) => {
                if(!currentFonts.includes(fontId)){
                    currentFonts.push(fontId)
                }
            });

            const updatedFonts = currentFonts.filter((fontId) => !remove.includes(fontId))

            if(updatedFonts.length <2){
                res.writeHead(400, {"Content-Type": "application/json"})
                return res.end(JSON.stringify({message: "A font group must contain at least 2 fonts."}))
            }

            group.fonts = updatedFonts
            await group.save()

            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify({
                message: "Font group updated successfully.",
                updatedFonts: group.fonts
            }))

        } catch (error) {
            res.writeHead(500, {"Content-Type": "application/json"})
            return res.end(JSON.stringify({
                message: "Error updating font group.",
                error: error.message
            }))
        }
    })

    req.on("error", (error) => {
        res.writeHead(500, {"Content-Type": "application/json"})
        res.end(JSON.stringify({
            message: "Request error.",
            error: error.message
        }))
    })
}