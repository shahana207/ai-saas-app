import { MessageSquare, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const { getToken } = useAuth();

  // Fetch all community posts (published creations)
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/ai/get-published-creations');
      if (data.success) {
        setPosts(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Submit a new topic/question
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setLoading(true);
      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt: input, length: 500 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Post added successfully!');
        setInput('');
        fetchPosts(); // refresh posts
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-col gap-6 text-slate-700">
      
      {/* Create Post */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF6F61]" />
          <h1 className="text-xl font-semibold">Community</h1>
        </div>

        <p className="mt-4 text-sm font-medium">Share your topic or question</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Ask a question or share your idea..."
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF6F61] to-[#FF3D3D] text-white px-4 py-2 mt-4 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <MessageSquare className="w-5" />
          )}
          Post
        </button>
      </form>

      {/* Display Posts */}
      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center text-gray-400 text-sm mt-6">
            <MessageSquare className="w-9 h-9 mb-2" />
            <p>No community posts yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-600">{post.prompt}</p>
              <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                {post.content}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Posted by {post.user_id} • {new Date(post.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;