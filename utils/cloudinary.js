import dotenv from 'dotenv';
dotenv.config();
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


// console.log("name",process.env.CLOUDINARY_CLOUD_NAME);
// console.log("api",process.env.CLOUDINARY_CLOUD_API);
// console.log("secret",process.env.CLOUDINARY_SECRET_KEY);CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@aw6rwmgc

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_API, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

const UploadToCloudinary = async(LocalFilePath)=>{

    try{

        

    
    if(!LocalFilePath) return null
    //upload the file on cloudinary
    
    const response = await cloudinary.uploader.upload(LocalFilePath,{
        resource_type:"auto"
    })

    console.log(response);

    //file has bee successfully uploaded
    console.log("file is uploaded on cloudinary",
        response.url);

        if (fs.existsSync(LocalFilePath)) {
        fs.unlinkSync(LocalFilePath);
    }
    
    return response;

    }
    catch (err) {
    console.log("Cloudinary Error:");
    console.log(err);

    if (fs.existsSync(LocalFilePath)) {
        fs.unlinkSync(LocalFilePath);
    }

    return null;
}
}

export default UploadToCloudinary ;

