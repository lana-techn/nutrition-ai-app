import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);

    if (!postId) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const [post] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.id, postId), eq(blogPosts.published, true)));

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const postResponse = {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      imageUrl: post.imageUrl || undefined,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return NextResponse.json(postResponse);

  } catch (error) {
    console.error('Blog post details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}