import { api } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { BlogPost } from "./types";

interface ListBlogPostsResponse {
  posts: BlogPost[];
}

// Retrieves all published blog posts.
export const listBlogPosts = api<void, ListBlogPostsResponse>(
  { expose: true, method: "GET", path: "/blog" },
  async () => {
    const posts = await nutritionDB.queryAll<{
      id: number;
      title: string;
      content: string;
      excerpt: string;
      author: string;
      category: string;
      image_url: string | null;
      published: boolean;
      created_at: Date;
      updated_at: Date;
    }>`SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC`;

    return {
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category,
        imageUrl: post.image_url || undefined,
        published: post.published,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      }))
    };
  }
);
