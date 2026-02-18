import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        const result = await cloudinary.uploader.upload(file)
        try{
            if (fs.existsSync(file)) fs.unlinkSync(file)
        }catch(e){
            console.log('error removing temp file', e)
        }
        return result.secure_url
    } catch (error) {
        try{
            if (file && fs.existsSync(file)) fs.unlinkSync(file)
        }catch(e){
            console.log('error removing temp file after upload failure', e)
        }
        console.error('cloudinary upload error:', error)
        throw error
    }
}

export default uploadOnCloudinary