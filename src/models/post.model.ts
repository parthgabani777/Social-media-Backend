import mongoose from "mongoose";
import { UserSchema } from "./user.model";

export const CommentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    votes: {
        upvotedBy: [UserSchema],
        downvotedBy: [UserSchema],
    },
    createdAt: { type: Date, default: Date.now },
});

export const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    likes: {
        likeCount: { type: String, required: true },
        likedBy: [UserSchema],
        dislikedBy: [UserSchema],
    },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const PostModel = mongoose.model("post", PostSchema);
