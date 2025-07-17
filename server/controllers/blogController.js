import fs from 'fs'
import imagekit from '../configs/imageKit.js';

export const addBlog = async (req, res)=>{
    try{
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // check if all fields present
        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: "missing required fields"})
        }

        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // opitmization through URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, // auto compression 
                {format: 'webp'}, // convert to modern format
                {width: '1280'} // width resizing
            ]
        })
        
    }catch(error){

    }
}