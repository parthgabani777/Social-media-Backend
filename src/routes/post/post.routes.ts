import Express from "express";
import {
    addPost,
    deletePost,
    getAllPosts,
    getPost,
    getUserPosts,
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
        const postData = req.body;
        const post = await addPost(postData, req.user.userId);
        res.status(200).send(responseDataSerialize({ posts: post }));
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
        await deletePost(postId, req.user.userId);
        res.status(200).send();
    } catch (error) {
        next(error);
    }
});

postRouter.post("/:postId", RequiresAuth, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.userId;
        const postData = req.body;
        await updatePost(postId, userId, postData);
        res.status(200).send();
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

export { postRouter };
