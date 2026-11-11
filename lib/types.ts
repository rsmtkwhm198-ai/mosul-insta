export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export type Author = Pick<Profile, "id" | "username" | "full_name" | "avatar_url">;

export type FeedPost = {
  id: string;
  caption: string | null;
  image_url: string;
  created_at: string;
  user_id: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  liked: boolean;
};

export type PostComment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  author: Author;
};
