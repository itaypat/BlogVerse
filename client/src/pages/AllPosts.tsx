import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface Post {
  postId: number;
  title: string;
  author: string;
  content: string;
  date: string;
  summary?: string;
}

export default function AllPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/post/");
        setPosts(res.data);
      } catch (err) {
        setError("Failed to load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const title = p.title?.toLowerCase() ?? "";
      const content = p.content?.toLowerCase() ?? "";
      const author = p.author?.toLowerCase() ?? "";
      const summary = p.summary?.toLowerCase() ?? "";
      return (
        title.includes(q) || content.includes(q) || author.includes(q) || summary.includes(q)
      );
    });
  }, [posts, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white/70">Loading posts…</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">{error}</div>
    );
  }

  return (
    <main>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          All Posts
        </h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title, content, or author"
              className="pl-9 bg-white/10 border-white/20 text-white placeholder-white/50"
              aria-label="Search posts"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm hover:from-pink-500 hover:to-purple-500 transition whitespace-nowrap"
          >
            Create New Post
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-white/70">
          {posts.length === 0
            ? "No posts yet. Be the first to create one!"
            : "No posts match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.postId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 transition cursor-pointer"
              dir="auto"
              style={{ unicodeBidi: 'plaintext' }}
              onClick={() => navigate(`/post/${post.postId}`)}
            >
              <h2 className="text-xl font-semibold text-purple-300 mb-1" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                {post.title}
              </h2>
              <p className="text-xs text-white/40 mb-3">
                {post.date ? new Date(post.date).toDateString() : ""}
              </p>
              <p className="text-white/80 line-clamp-3" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                {post.summary || post.content}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${post.postId}`);
                }}
                className="mt-4 text-sm text-blue-400 hover:underline"
              >
                Read More →
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
