import express from "express";
import { getAllUsers, getUserByUsername } from "../../db/user.db";
import { responseDataSerialize } from "../../serialize";
import { HttpException } from "../../error";
import { updateUser } from "../../db/user.db";
import { RequiresAuth } from "../../middleware/auth.middleware";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).send(responseDataSerialize({ users: users }));
    } catch (error) {
        next(error);
    }
});

userRouter.get("/:usedId", async (req, res, next) => {
    try {
        const userId = req.params.usedId;
        const userData = await getUserByUsername(userId);
        res.status(200).send(responseDataSerialize({ user: userData }));
    } catch (error) {
        next(error);
    }
});

userRouter.post("/edit", RequiresAuth, async (req, res, next) => {
    try {
        if (!req.user) {
            throw new HttpException(400, "Bad request");
        }
        const userData = req.body;

        let updatedUserData = await updateUser(req.user.userId, userData);
        res.status(200).send(responseDataSerialize({ user: updatedUserData }));
    } catch (error) {
        next(error);
    }
});

export { userRouter };
