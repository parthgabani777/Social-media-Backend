import express from "express";
import {
    addBookmark,
    followUser,
    getAllUsers,
    getBookmarks,
    getUserByUserId,
    removeBookmark,
    unfollowUser,
} from "../../db/user.db";
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

userRouter.post("/edit", RequiresAuth, async (req, res, next) => {
    try {
        if (!req.user) {
            throw new HttpException(400, "Bad request");
        }
        const { userData } = req.body;

        let updatedUserData = await updateUser(req.user.userId, userData);
        res.status(200).send(responseDataSerialize({ user: updatedUserData }));
    } catch (error) {
        next(error);
    }
});

userRouter.get("/bookmark", RequiresAuth, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const bookmarks = await getBookmarks(userId);
        res.status(200).send(responseDataSerialize({ bookmarks: bookmarks }));
    } catch (error) {
        next(error);
    }
});

userRouter.post("/bookmark/:postId", RequiresAuth, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const postId = req.params.postId;
        const bookmarks = await addBookmark(userId, postId);
        res.status(200).send(responseDataSerialize({ bookmarks: bookmarks }));
    } catch (error) {
        next(error);
    }
});

userRouter.post(
    "/remove-bookmark/:postId",
    RequiresAuth,
    async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const postId = req.params.postId;
            const bookmarks = await removeBookmark(userId, postId);
            res.status(200).send(
                responseDataSerialize({ bookmarks: bookmarks })
            );
        } catch (error) {
            next(error);
        }
    }
);

userRouter.get("/:usedId", async (req, res, next) => {
    try {
        const userId = req.params.usedId;
        const userData = await getUserByUserId(userId);
        res.status(200).send(responseDataSerialize({ user: userData }));
    } catch (error) {
        next(error);
    }
});

userRouter.post(
    "/follow/:followUserId",
    RequiresAuth,
    async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const followUserId = req.params.followUserId;

            const { user, followUser: followUserData } = await followUser(
                userId,
                followUserId
            );

            res.status(200).send(
                responseDataSerialize({
                    user: user,
                    followUser: followUserData,
                })
            );
        } catch (error) {
            next(error);
        }
    }
);

userRouter.post(
    "/unfollow/:followUserId",
    RequiresAuth,
    async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const followUserId = req.params.followUserId;

            const { user, followUser: followUserData } = await unfollowUser(
                userId,
                followUserId
            );

            res.status(200).send(
                responseDataSerialize({
                    user: user,
                    followUser: followUserData,
                })
            );
        } catch (error) {
            next(error);
        }
    }
);

export { userRouter };
