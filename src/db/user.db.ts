import mongoose from "mongoose";
import { HttpException } from "../error";
import { UserModel } from "../models/user.model";

export async function getAllUsers() {
    const users = await UserModel.find();
    return users;
}

export async function getUserByUsername(username: string) {
    const user = await UserModel.findOne({ username: username }).populate(
        "bookmarks"
    );
    if (!user) {
        throw new HttpException(404, "Username doest not exist");
    }
    return user;
}

export async function getUserByUserId(userId: string) {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        throw new HttpException(404, "UserId doest not exist");
    }
    return user;
}

export async function addUser(userData: UserInterface) {
    let user = new UserModel({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    user = await (await user.save()).populate("bookmarks");
    return user;
}

export async function updateUser(
    userId: string,
    userData: EditUserDataInterface
) {
    let user = await UserModel.findOneAndUpdate(
        { _id: userId },
        { ...userData },
        { returnDocument: "after" }
    );
    return user;
}

export async function getBookmarks(userId: string) {
    const user = await UserModel.findOne({ _id: userId }).populate({
        path: "bookmarks",
        populate: "postCreatedBy",
    });
    if (!user) {
        throw new HttpException(404, "Can't find User.");
    }
    return user.bookmarks;
}

export async function addBookmark(userId: string, postId: string) {
    const updateWriteResult = await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { bookmarks: postId } }
    );
    if (updateWriteResult.matchedCount === 0) {
        throw new HttpException(404, "UserID does not exist.");
    }
    if (updateWriteResult.modifiedCount === 0) {
        throw new HttpException(400, "Post is already bookmarked.");
    }
    return getBookmarks(userId);
}

export async function removeBookmark(userId: string, postId: string) {
    const updateWriteResult = await UserModel.updateOne(
        { _id: userId },
        { $pull: { bookmarks: postId } }
    );
    if (updateWriteResult.matchedCount === 0) {
        throw new HttpException(404, "UserID does not exist.");
    }
    if (updateWriteResult.modifiedCount === 0) {
        throw new HttpException(400, "Post is already not bookmarked.");
    }
    return getBookmarks(userId);
}

export async function followUser(userId: string, followUserId: string) {
    if (userId === followUserId) {
        throw new HttpException(400, "Can't follow yourself");
    }

    const session = await mongoose.startSession();

    try {
        let user, followUser;
        await session.withTransaction(async () => {
            followUser = await UserModel.findOneAndUpdate(
                { _id: followUserId },
                { $addToSet: { followers: userId } },
                { returnDocument: "after", session: session }
            );

            user = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { followings: followUserId } },
                { returnDocument: "after", session: session }
            ).populate("bookmarks");

            if (!user || !followUser) {
                throw new HttpException(404, "can't find user.");
            }
        });
        return { user, followUser };
    } finally {
        await session.endSession();
    }
}

export async function unfollowUser(userId: string, followUserId: string) {
    if (userId === followUserId) {
        throw new HttpException(400, "Can't unfollow yourself");
    }

    const session = await mongoose.startSession();

    try {
        let followUser, user;
        await session.withTransaction(async () => {
            followUser = await UserModel.findOneAndUpdate(
                { _id: followUserId },
                { $pull: { followers: userId } },
                { returnDocument: "after", session: session }
            );

            user = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $pull: { followings: followUserId } },
                { returnDocument: "after", session: session }
            ).populate("bookmarks");

            if (!user || !followUser) {
                throw new HttpException(404, "can't find user.");
            }
        });
        return { user, followUser };
    } finally {
        await session.endSession();
    }
}
