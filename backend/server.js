import http from "http"
import envConfig from "./config/env.config.js"
import mongoose from "mongoose"
import { deleteFont, getFonts, uploadFonts } from "./controller/fontList.controller.js"
import FontModel from "./model/font.model.js"
import { createFontGroup, deleteFontGroup, getFontGroups, updateFontGroup } from "./controller/fontGroup.controller.js"


const {PORT, MONGODB_URI, MONGODB_COLLECTION} = envConfig

const setCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer((req, res)=> {

    setCorsHeaders(res)

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const [_, route, param] = req.url.split("/")

    // POST /upload-fonts
    if(req.url === '/upload-fonts' && req.method === "POST") {
        return uploadFonts(req,res)
    }

    // GET /fonts
    if(req.url === "/fonts" && req.method === "GET"){
        return getFonts(req, res)
    }

    // DELETE /fonts/:id
    if(route === "fonts" && param && req.method === "DELETE"){
        return deleteFont(req,res)
    }

    // POST /create-font-group
    if(req.url === "/create-font-group" && req.method === "POST"){
        return createFontGroup(req, res)
    }

    // GET /font-groups
    if(req.url === "/font-groups" && req.method === "GET"){
        return getFontGroups(req, res)
    }

    // DELETE /font-group/:id
    if(route === "font-group" && param && req.method === "DELETE"){
        return deleteFontGroup(req, res)
    }

    // PATCH /font-group/:id
    if(route === "font-group" && param && req.method === "PATCH"){
        return updateFontGroup(req, res)
    }

    res.writeHead(404, {"Content-Type": "text/plain"})
    res.end("Not Found")
})


// Server and Database connection
mongoose.connect(`${MONGODB_URI}/font-groups`)
    .then(() => {
        console.log(`Connected to mongodb: ${mongoose.connection.name}`)

        //FontModel.createIndexes()

        server.listen(PORT, () => console.log(`Server running on ${PORT}`))
    })
    .catch(error => {
        console.log(error)
    })
