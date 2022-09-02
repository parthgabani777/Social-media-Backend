import mongoose, { Schema } from "mongoose";
import { HttpException } from "../error";
import { PostModel } from "./post.model";

const passwordFormatValidator = async function (password: string) {
    return password.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    );
};

export const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "FirstName is Required"],
    },
    lastName: {
        type: String,
        cast: [true, "LastName can only be string"],
        required: [true, "LastName is Required"],
    },
    username: {
        type: String,
        cast: [false, "username can only be string"],
        unique: [true, "Username already exist"],
        required: [true, "Username is Required"],
        immutable: [true, "Can't change username"],
    },
    password: {
        type: String,
        cast: [false, "password can only be string"],
        required: [true, "Password is Required"],
        validate: {
            validator: passwordFormatValidator,
            message: "Password Format is wrong",
        },
    },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followings: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    picture: { type: String },
});

UserSchema.post("save", (error: any, doc: any, next: any) => {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new HttpException(409, "Username already exist"));
    } else {
        next();
    }
});

export const UserModel = mongoose.model("user", UserSchema);
