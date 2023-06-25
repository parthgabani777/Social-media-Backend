import Express from "express";
import {
  addPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getPost,
  getUserPosts,
  likePost,
  updatePost,
} from "../../db/post.db";
import { RequiresAuth } from "../../middleware/auth.middleware";
import { responseDataSerialize } from "../../serialize";

const postRouter = Express.Router();

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.status(200).send(responseDataSerialize({ posts: posts }));
  } catch (error) {
    next(error);
  }
});

postRouter.post("/", RequiresAuth, async (req, res, next) => {
  try {
    const { postData } = req.body;
    const posts = await addPost(postData, req.user.userId);
    res.status(200).send(responseDataSerialize({ posts: posts }));
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await getPost(postId);
    res.status(200).send(responseDataSerialize({ post: post }));
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", RequiresAuth, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const posts = await deletePost(postId, req.user.userId);
    res.status(200).send(responseDataSerialize({ posts: posts }));
  } catch (error) {
    next(error);
  }
});

postRouter.post("/edit/:postId", RequiresAuth, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const { postData } = req.body;
    const posts = await updatePost(postId, userId, postData);
    res.status(200).send(responseDataSerialize({ posts: posts }));
  } catch (error) {
    next(error);
  }
});

postRouter.get("/user/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    const userPosts = await getUserPosts(username);
    res.status(200).send(responseDataSerialize({ posts: userPosts }));
  } catch (error) {
    next(error);
  }
});

postRouter.post("/like/:postId", RequiresAuth, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const post = await likePost(postId, userId);
    res.status(200).send(responseDataSerialize({ posts: post }));
  } catch (error) {
    next(error);
  }
});

postRouter.post("/dislike/:postId", RequiresAuth, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const post = await dislikePost(postId, userId);
    res.status(200).send(responseDataSerialize({ posts: post }));
  } catch (error) {
    next(error);
  }
});

export { postRouter };
