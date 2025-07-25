import mongoose from "mongoose";

const FontGroupSchema = new mongoose.Schema({
    fonts: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Font",
                required: true
            }
        ],
        validate: [arrayLimit, "A font group must contain at least 2 fonts."]
    },
})

function arrayLimit(arr) {
    return arr.length >= 2
}

export default mongoose.model('FontGroup', FontGroupSchema)