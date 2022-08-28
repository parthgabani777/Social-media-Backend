import express, { Express } from "express";
import { dbConnect } from "./db/db.connect";
import { authRouter } from "./routes/auth/auth.routes";
import bodyParser from "body-parser";
import { userRouter } from "./routes/user/users.routes";
import { errorHandler, HttpException } from "./error";
import { postRouter } from "./routes/post/post.routes";

require("dotenv").config();
const port = process.env.PORT;
const app: Express = express();

app.use(bodyParser.json());

dbConnect();

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.use((req, res) => {
    throw new HttpException(404, "Can't find provided routes");
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
