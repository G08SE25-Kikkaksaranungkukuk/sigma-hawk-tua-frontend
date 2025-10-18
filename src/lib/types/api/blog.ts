export interface BlogLikePayload {
    likes: LikeBlog[]
}

export interface LikeBlog {
    user_id : number
    blog_id : number
}