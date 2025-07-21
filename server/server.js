import express from 'express'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' });

import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();

await connectDB()

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://legendary-spoon-xjp6j54rg5qhprrq-5173.app.github.dev',
  'https://keerthiga-quick-blog-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json())

// Routes
app.get('/', (req, res)=> res.send("API is working"))
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('server is runing on port: ', PORT);
})

export default app;