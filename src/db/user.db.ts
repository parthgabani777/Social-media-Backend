import { HttpException } from "../error";
import { UserModel } from "../models/user.model";

interface UserDateType {
    firstName: string;
    lastName: string;
    password: string;
}

export async function getAllUsers() {
    const users = await UserModel.find();
    return users;
}

export async function getUserByUsername(username: string) {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
        throw new HttpException(401, "Username doest not exist");
    }
    return user;
}

export async function addUser(userData: UserDateType) {
    let user = new UserModel({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    user = await user.save();
    return user;
}

export async function updateUser(userId: string, userData: UserDateType) {
    let user = await UserModel.findOneAndUpdate(
        { _id: userId },
        { ...userData },
        { returnDocument: "after" }
    );
    return user;
}
export async function addBookmark(userId: string, postId: string) {
    const updateWriteResult = await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { bookmarks: postId } }
    );
    if (updateWriteResult.matchedCount === 0) {
        throw new HttpException(400, "UserID does not exist.");
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
        throw new HttpException(400, "UserID does not exist.");
    }
    if (updateWriteResult.modifiedCount === 0) {
        throw new HttpException(400, "Post is already not bookmarked.");
    }
    return getBookmarks(userId);
}

export async function getBookmarks(userId: string) {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        throw new HttpException(400, "Can't find User.");
    }
    return user.bookmarks;
}
