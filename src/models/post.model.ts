import mongoose, { Schema } from "mongoose";
import { UserModel } from "./user.model";

export const CommentSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    votes: {
        upvotedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
        downvotedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    createdAt: { type: Date, default: Date.now },
});

export const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    likes: {
        likeCount: { type: Number, required: true },
        likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
        dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const PostModel = mongoose.model("post", PostSchema);
