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
}

export async function addPost(postData: AddPostDataType, userId: string) {
    const post = new PostModel({
        ...postData,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: {
            likeCount: 0,
            likedBy: [],
            dislikedBy: [],
        },
        comments: [],
    });

    const addedPost = await post.save();
    return addedPost;
}

export async function deletePost(postId: string, userId: string) {
    const post = await PostModel.deleteOne({ _id: postId, userId: userId });
    console.log(post);
    if (post.deletedCount === 0) {
        throw new HttpException(400, "Can't find post");
    }
    return post;
}

export async function updatePost(
    postId: string,
    userId: string,
    postData: AddPostDataType
) {
    const post = await PostModel.findOneAndUpdate(
        { _id: postId, userId: userId },
        { ...postData },
        { returnDocument: "after" }
    );
    if (!post) {
        throw new HttpException(400, "Can't find post");
    }
    return post;
}
