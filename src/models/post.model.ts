import mongoose, { Schema } from "mongoose";
import { UserModel } from "./user.model";

export const CommentSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: UserModel },
    text: { type: String, required: true },
    votes: {
        upvotedBy: [{ type: Schema.Types.ObjectId, ref: UserModel }],
        downvotedBy: [{ type: Schema.Types.ObjectId, ref: UserModel }],
    },
    createdAt: { type: Date, default: Date.now },
});

export const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    likes: {
        likeCount: { type: String, required: true },
        likedBy: [{ type: Schema.Types.ObjectId, ref: UserModel }],
        dislikedBy: [{ type: Schema.Types.ObjectId, ref: UserModel }],
    },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const PostModel = mongoose.model("post", PostSchema);
