export interface NewsItem {
  id: string;
  title: string;
  content: string | null;
  source: string;
  category: string;
  url: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface FeedResponse {
  items: NewsItem[];
  nextCursor: {
    publishedAt: string;
    id: string;
  } | null;
};