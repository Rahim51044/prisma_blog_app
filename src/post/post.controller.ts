import { Request, Response } from "express"
import { postService } from "./post.service"

// create post
const createPost = async (req:Request, res:Response) => {
try {
  const user = req.user;
  if(!user){
   return res.status(400).json({
    error: "Unauthorized"
  })
  }


const result = await postService.createPost(req.body, user.id)
res.status(201).json(result)
} catch (e) {
  res.status(400).json({
    error: "post create failed",
    details: e
  })
}
}


// getPost
// const getAllPost = async (req: Request, res: Response)=>{
//   try {
//     const {search} = req.query;
//     const searchString = typeof search === 'string'? search : undefined; 
//     const tags = req.query.tags ? (req.query.tags as string).split(',') : [];

//     const result = await postService.getAllPost({search: searchString, tags})
//     res.status(200).json(result)
//   } catch (e) {
//     res.status(400).json({
//     error: "post Ritrieved failed",
//     details: e
//   }) 
//   }
// }


const getAllPost = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" && req.query.search.trim()
        ? req.query.search
        : undefined;

    const tags =
      typeof req.query.tags === "string"
        ? req.query.tags
            .split(",")
            .map(t => t.trim())
            .filter(t => t.length > 0)
        : [];

    const result = await postService.getAllPost({ search, tags });
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "post Retrieved failed",
      message: e.message,
      stack: e.stack
    });
  }
};


export const postController = {
  createPost,
  getAllPost
}