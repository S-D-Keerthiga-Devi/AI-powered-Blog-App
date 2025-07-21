import express from "express";
import { addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublish, 
  addComment,
  getBlogComments,
  generateContent} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog);

blogRouter.get('/all', getAllBlogs);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish); 
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', generateContent);
blogRouter.get('/:blogId', getBlogById);

export default blogRouter;