export interface CommentType {
    username: string;
    text: string;
    votes: {
        upvotedBy: any[];
        downvotedBy: any[];
    };
    createdAt: Date;
}
