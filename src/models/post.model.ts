import mongoose, { Schema } from "mongoose";

export const CommentSchema = new mongoose.Schema({
    commentedBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
    text: { type: String, required: true },
    votes: {
        upvotedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
        downvotedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    createdAt: { type: Date, default: Date.now },
});

export const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    likes: {
        likeCount: { type: Number, required: true },
        likedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
        dislikedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    postCreatedBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const PostModel = mongoose.model("post", PostSchema);
