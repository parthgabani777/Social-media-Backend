import { HttpException } from "../error";
import { PostModel } from "../models/post.model";

export async function getComments(postId: string) {
  const post = await PostModel.findOne({ _id: postId });
  if (!post) {
    throw new HttpException(404, "can't find post");
  }
  return post.comments;
}

interface CommentDataType {
  text: string;
}

export async function addComment(
  postId: string,
  userId: string,
  commentData: CommentDataType
) {
  const post = await PostModel.findOne({ _id: postId });
  if (!post) {
    throw new HttpException(404, "can't find post");
  }
  post.comments.push({ ...commentData, commentedBy: userId });
  const addedPost = await (await post.save()).populate("comments.commentedBy");
  return addedPost.comments;
}

export async function editComment(
  postId: string,
  commentId: string,
  userId: string,
  commentData: CommentDataType
) {
  const post = await PostModel.findOneAndUpdate(
    {
      _id: postId,
      "comments.commentedBy": userId,
      "comments._id": commentId,
    },
    { $set: { "comments.$.text": commentData.text } },
    { returnDocument: "after" }
  );

  if (!post) {
    throw new HttpException(404, "can't find post");
  }
  return post.comments;
}

export async function deleteComment(
  postId: string,
  commentId: string,
  userId: string
) {
  const post = await PostModel.findOneAndUpdate(
    {
      _id: postId,
      "comments.userId": userId,
      "comments._id": commentId,
    },
    {
      $pull: {
        comments: { _id: commentId },
      },
    },
    {
      returnDocument: "after",
    }
  );
  if (!post) {
    throw new HttpException(404, "can't find post");
  }
  return post.comments;
}
