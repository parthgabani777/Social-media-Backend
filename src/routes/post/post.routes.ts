import Express from "express";
import { getAllPosts, getPost, getUserPosts } from "../../db/post.db";
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
        const post = req.body;
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
