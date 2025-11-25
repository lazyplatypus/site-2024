import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

function checkSupabaseConfig() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }
  return true;
}

interface Comment {
  id: string;
  page: string;
  author: string;
  content: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!checkSupabaseConfig()) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json(
        { error: 'Page parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('page', page)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    // Transform to match the expected format (timestamp instead of created_at)
    const comments = (data || []).map((comment) => ({
      id: comment.id,
      page: comment.page,
      author: comment.author,
      content: comment.content,
      timestamp: comment.created_at,
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkSupabaseConfig()) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { page, author, content } = body;

    // Validate required fields
    if (!page || !author || !content) {
      return NextResponse.json(
        { error: 'Page, author, and content are required' },
        { status: 400 }
      );
    }

    // Trim and validate content
    const trimmedAuthor = author.trim();
    const trimmedContent = content.trim();

    if (trimmedAuthor.length === 0 || trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Author and content cannot be empty' },
        { status: 400 }
      );
    }

    // Insert new comment into Supabase
    const { data, error } = await supabase
      .from('comments')
      .insert({
        page: page.trim(),
        author: trimmedAuthor,
        content: trimmedContent,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    // Transform to match expected format
    const newComment = {
      id: data.id,
      page: data.page,
      author: data.author,
      content: data.content,
      timestamp: data.created_at,
    };

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
