import express from "express";
import {
    addComment,
    deleteComment,
    editComment,
    getComments,
} from "../../db/comment.db";
import { HttpException } from "../../error";
import { RequiresAuth } from "../../middleware/auth.middleware";
import { responseDataSerialize } from "../../serialize";

const commentRouter = express.Router();

commentRouter.get("/:postId", async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const comments = await getComments(postId);
        res.status(200).send(responseDataSerialize({ comments: comments }));
    } catch (error) {
        next(error);
    }
});

commentRouter.post("/add/:postId", RequiresAuth, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.userId;
        const { commentData } = req.body;
        const comments = await addComment(postId, userId, commentData);
        res.status(200).send(responseDataSerialize({ comments: comments }));
    } catch (error) {
        next(error);
    }
});

commentRouter.post(
    "/edit/:postId/:commentId",
    RequiresAuth,
    async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const userId = req.user.userId;
            const commentId = req.params.commentId;
            const { commentData } = req.body;
            if (!commentData || !commentData.text) {
                throw new HttpException(
                    400,
                    "Please provide valid comment data"
                );
            }
            const comments = await editComment(
                postId,
                commentId,
                userId,
                commentData
            );
            res.status(200).send(responseDataSerialize({ comments: comments }));
        } catch (error) {
            next(error);
        }
    }
);

commentRouter.delete(
    "/delete/:postId/:commentId",
    RequiresAuth,
    async (req, res, next) => {
        try {
            const postId = req.params.postId;
            const userId = req.user.userId;
            const commentId = req.params.commentId;
            const comments = await deleteComment(postId, commentId, userId);
            res.status(200).send(responseDataSerialize({ comments: comments }));
        } catch (error) {
            next(error);
        }
    }
);

export { commentRouter };
