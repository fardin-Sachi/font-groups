import 'dotenv/config'

const config = {
    PORT: process.env.PORT,
    API: process.env.API,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_COLLECTION: process.env.MONGODB_COLLECTION,
    
}

export default config