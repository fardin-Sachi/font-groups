import mongoose from 'mongoose';

const FontSchema = new mongoose.Schema({
  fileName: {
      type: String,
      required: true
    },
    fontData: {
        type: Buffer,
        required: true
    },
});

export default mongoose.model('Font', FontSchema)