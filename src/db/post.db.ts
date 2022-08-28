import { HttpException } from "../error";
import { PostModel } from "../models/post.model";

export async function getAllPosts() {
    const allPosts = await PostModel.find();
    return allPosts;
}

export async function getPost(postId: string) {
    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
        throw new HttpException(409, "post does not exist");
    }
    return post;
}

export async function getUserPosts(username: string) {
    const posts = await PostModel.find({ username: username });
    return posts;
}

interface AddPostDataType {
    content: string;
    username: string;
}

export async function addPost(postData: AddPostDataType) {
    const post = new PostModel({
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: {
            likesCount: 0,
            likedBy: [],
            dislikedBy: [],
        },
        comments: [],
    });

    await post.save();
}
