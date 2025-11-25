'use client';

import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  page: string;
  author: string;
  content: string;
  timestamp: string;
}

interface CommentsProps {
  page: string;
}

export function Comments({ page }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>('');

  // Set origin only on client side to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments?page=${encodeURIComponent(page)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [page]);

  // Only compute curl command when origin is available to avoid hydration mismatch
  const curlCommand = origin 
    ? `curl -X POST ${origin}/api/comments -H "Content-Type: application/json" -d '{"page":"${page}","author":"Your Name","content":"Your comment here"}'`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      // You could add a toast notification here if desired
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="mt-16 pt-8 border-t-2 border-gray-300">
      <h2 className="text-gray-900 font-semibold text-2xl mt-8 mb-6">Comments</h2>
      
      {/* Curl command section - only render when origin is available */}
      {curlCommand && (
        <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Copy this command to add a comment:</p>
            <button
              onClick={copyToClipboard}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 bg-white rounded-md border border-gray-300 hover:border-blue-400"
            >
              Copy
            </button>
          </div>
          <pre className="curl-command-pre text-xs overflow-x-auto p-4 rounded-md border border-gray-400 font-mono shadow-inner">
            <code>{curlCommand}</code>
          </pre>
        </div>
      )}

      {/* Comments list */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm">Loading comments...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-white border-l-4 border-blue-500 pl-5 py-4 pr-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <p className="font-semibold text-gray-900 text-base">{comment.author}</p>
                <span className="text-xs text-gray-500 font-medium">{formatDate(comment.timestamp)}</span>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

