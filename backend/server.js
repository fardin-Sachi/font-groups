import http from "http"
import config from "./config/env.config.js"
import mongoose from "mongoose"
import formidable from "formidable"
import fs from "fs"
import FontModel from "./model/fontModel.js"


const {PORT, MONGODB_URI, MONGODB_COLLECTION} = config

const server = http.createServer((req, res)=> {
    
})


// Server and Database connection
mongoose.connect(`${MONGODB_URI}/${MONGODB_COLLECTION}`)
    .then(() => {
        console.log("Connected to mongodb")

        // UsersModel.createIndexes()

        server.listen(PORT, () => console.log(`Server running on ${PORT}`))
    })
    .catch(error => {
        console.log(error)
    })
