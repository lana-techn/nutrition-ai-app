import { api, APIError } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { BlogPost } from "./types";

interface GetBlogPostRequest {
  id: number;
}

// Retrieves a specific blog post by ID.
export const getBlogPost = api<GetBlogPostRequest, BlogPost>(
  { expose: true, method: "GET", path: "/blog/:id" },
  async (req) => {
    const post = await nutritionDB.queryRow<{
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
    }>`SELECT * FROM blog_posts WHERE id = ${req.id} AND published = true`;

    if (!post) {
      throw APIError.notFound("Blog post not found");
    }

    return {
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
    };
  }
);
