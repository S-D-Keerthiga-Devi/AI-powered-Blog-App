import fs from 'fs'
import Blog from '../models/Blog.js';
import imagekit from '../configs/imageKit.js';
import { error } from 'console';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // check if all fields present
        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "missing required fields" })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // opitmization through URL transformation
        const filePath = response.filePath.startsWith("/")
            ? response.filePath
            : `/${response.filePath}`;


        const optimizedImageUrl = imagekit.url({
            path: filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        });


        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })

        res.json({ success: true, message: "Blog created successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllBlogs = async (req, res)=>{
    try{
        const blogs = await Blog.find({isPublished: true})
        res.json({success: true, blogs})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const deleteBlogById = async (req, res) =>{
    try{
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        // delete all comment associated with it
        await Comment.deleteMany({blog: id});

        res.json({success: true, message: "Blog deleted successfully"})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: 'Blog status updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const getBlogById = async (req, res)=>{
    try{
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const addComment = async (req, res)=>{
    try{
        const { blog, name, content } = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: "Comment added for review"})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const getBlogComments = async (req, res)=>{
        try{
            const {blogId} = req.body;
            const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
            res.json({success: true, comments})
        }catch(error){
            res.json({success: false, message: error.message})
        }
}

export const generateContent = async (req, res)=>{
    try{
        const {prompt} = req.body;
        const content = await main(prompt + 'Generate a blog content for this topic in a simple text format')
        res.json({success: true, content})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}