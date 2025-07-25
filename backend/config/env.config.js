import 'dotenv/config'

const envConfig = {
    PORT: process.env.PORT || 8000,
    API: process.env.API,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_COLLECTION: process.env.MONGODB_COLLECTION,
    
}

export default envConfig