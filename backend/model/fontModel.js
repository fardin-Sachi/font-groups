import mongoose from "mongoose";

const FontSchema = new mongoose.Schema({
    name: String,
    fontData: Buffer,
    contentType: String,
})

export default mongoose.model('Font', FontSchema)