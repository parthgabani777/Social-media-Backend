import express, { application, Express } from "express";
import { dbConnect } from "./db/db.connect";
import { authRouter } from "./routes/auth/auth.routes";
import bodyParser from "body-parser";
import { userRouter } from "./routes/user/users.routes";
import { errorHandler, HttpException } from "./error";
import { postRouter } from "./routes/post/post.routes";
import { commentRouter } from "./routes/comment/comment.routes";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

require("dotenv").config();
const port = process.env.PORT;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json({ limit: "1MB" }));

dbConnect();

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((req, res) => {
    throw new HttpException(404, "Can't find provided route");
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
