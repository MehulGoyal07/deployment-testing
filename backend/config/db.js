import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`

export const connectDB = async() => {
    try {
        await mongoose.connect(uri)
        console.log('DB CONNECTED')
    } catch (err) {
        console.error('DB CONNECTION ERROR:', err)
    }
}