export interface Blog {
    blog_id: number;
    user_id: number;
    title: string;
    description: string;
    created_at: string;
    json_config: string;
    html_output: string;
    blog_interests: BlogInterest[];
    likes: LikeBlog[];
}

export interface BlogInterest {
    interest_id: number;
    interest_name?: string;
}

export interface BlogLikePayload {
    likes: LikeBlog[]
}

export interface LikeBlog {
    user_id : number
    blog_id : number
}