import { HttpException } from "../error";
import { PostModel } from "../models/post.model";

export async function getAllPosts() {
  const allPosts = await PostModel.find().populate("postCreatedBy");
  return allPosts;
}

export async function getPost(postId: string) {
  const post = await PostModel.findOne({ _id: postId })
    .populate("postCreatedBy")
    .populate("comments.commentedBy");
  if (!post) {
    throw new HttpException(404, "post does not exist");
  }
  return post;
}

export async function getUserPosts(username: string) {
  const posts = await PostModel.find({ postCreatedBy: username }).populate(
    "postCreatedBy"
  );
  return posts;
}

interface AddPostDataType {
  content: string;
}

export async function addPost(postData: AddPostDataType, userId: string) {
  const post = new PostModel({
    ...postData,
    postCreatedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: {
      likeCount: 0,
      likedBy: [],
      dislikedBy: [],
    },
    comments: [],
  });

  await post.save();
  return getAllPosts();
}

export async function deletePost(postId: string, userId: string) {
  const post = await PostModel.deleteOne({ _id: postId, userId: userId });
  if (post.deletedCount === 0) {
    throw new HttpException(404, "Can't find post");
  }
  return getAllPosts();
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
    throw new HttpException(404, "Can't find post");
  }
  return getAllPosts();
}

export async function likePost(postId: string, userId: string) {
  const post = await PostModel.findOneAndUpdate(
    { _id: postId, "likes.likedBy": { $nin: userId } },
    {
      $push: { "likes.likedBy": userId },
      $pull: { "likes.dislikedBy": userId },
      $inc: { "likes.likeCount": 1 },
    },
    { returnDocument: "after" }
  );
  if (!post) {
    throw new HttpException(
      400,
      "can't find post or you have already liked post."
    );
  }
  return getAllPosts();
}

export async function dislikePost(postId: string, userId: string) {
  const post = await PostModel.findOneAndUpdate(
    { _id: postId, "likes.dislikedBy": { $nin: userId } },
    {
      $push: { "likes.dislikedBy": userId },
      $pull: { "likes.likedBy": userId },
      $inc: { "likes.likeCount": -1 },
    },
    { returnDocument: "after" }
  );
  if (!post) {
    throw new HttpException(
      400,
      "can't find post or you have already disliked post."
    );
  }
  return getAllPosts();
}
