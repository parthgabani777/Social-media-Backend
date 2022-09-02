import express, { Express } from "express";
import { dbConnect } from "./db/db.connect";
import { authRouter } from "./routes/auth/auth.routes";
import bodyParser from "body-parser";
import { userRouter } from "./routes/user/users.routes";
import { errorHandler, HttpException } from "./error";
import { postRouter } from "./routes/post/post.routes";
import {
    addComment,
    editComment,
    getComments,
    deleteComment,
} from "./db/comment.db";
import { CommentSchema } from "./models/post.model";
import { commentRouter } from "./routes/comment/comment.routes";
import { dislikePost, likePost } from "./db/post.db";

require("dotenv").config();
const port = process.env.PORT;
const app: Express = express();

app.use(bodyParser.json());

dbConnect();

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", async (req, res, next) => {
    const tanay_userId = "62ff7e7e80f88f1793e01fa9";
    // const parth_userId = "6304e8dd99b56a3ffbe23ec6";
    // const userId1 = "62ff7e7e80f88f1793e01fa7";

    const postId1 = "62ff7dba80f88f1793e01fa3";
    // const postId2 = "630dd734c88b281f305adefc";
    const arr = [
        "62ff7dba80f88f1793e01f9d",
        "62ff7dba80f88f1793e01fa1",
        "62ff7dba80f88f1793e01f9f",
    ];

    const comment1 = "63106b6e8229418c95e42ba2";

    await likePost(postId1, tanay_userId);
    next();
});

app.use((req, res) => {
    throw new HttpException(404, "Can't find provided routes");
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
