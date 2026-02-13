import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../middleweres/auth";

const router = express.Router();

router.get(
  "/",
  postController.getAllPost
)

router.post(
  "/", 
  auth(UserRole.USER),
  postController.createPost
)

// ff
 export const postRouter = router;