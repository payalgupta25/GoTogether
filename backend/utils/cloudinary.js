import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (localpath)=>{
    try{

        if(!localpath) return null ;

        const response = await cloudinary.uploader.upload(localpath , {
            resource_type : "auto"          // auto will detect the type of file being uploaded
        })
        console.log("Cloudinary response" , response.url);
        console.log("File uploaded to cloudinary successfully");

        fs.unlinkSync(localpath);
        return response;
    }
    catch(err){
        console.log("Error in uploading to cloudinary" , err);
        fs.unlinkSync(localpath);      
        // Delete the local file in case of error as operation is failed
        return null ;
    }
}

export {uploadToCloudinary}