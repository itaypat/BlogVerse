// src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";

interface Post {
  postId: number;
  title: string;
  author: string;
  content: string;
  date: string;
  summary: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchPost = async () => {
      try {
        let res = await axiosInstance.get('/post/')
        setPosts(res.data)
      } catch (error) {
        console.log("Failed to load profile." , error);
      }
        
    }

    fetchPost()

  }, []);

  // Filter, shuffle and organize posts
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

  const shuffle = (arr: Post[]) => [...arr].sort(() => 0.5 - Math.random());
  const randomIndex = filteredPosts.length ? Math.floor(Math.random() * filteredPosts.length) : 0;
  const featuredPost : any = filteredPosts[randomIndex];
  const trendingPosts = shuffle(filteredPosts).slice(1, 4);
  const otherPosts = shuffle(filteredPosts).slice(2);

  // removed tags, replaced by search bar

  return (
    <main>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 tracking-wider text-center pt-10 pb-5">
          Welcome to SecondBrain
        </h1>
        <p className="text-white/60 text-center mt-2">
          AI powered website for managing knowlage
        </p>
      </motion.div>

      {/* Search */}
      <div className="flex justify-center mb-10 px-4">
        <div className="relative w-full max-w-xl">
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
      </div>

      {/* CTA */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/create")}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl shadow-lg transition-all"
        >
          <PlusCircle size={18} />
          Create New Post
        </button>
      </div>

      {/* Featured */}
      {featuredPost && (
        <div className="my-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-blue-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white/80 mb-2">
              🌟 Featured Post
            </h2>
            <h3 className="text-xl font-semibold text-purple-300">
              {featuredPost.title}
            </h3>
            <p className="text-white/60 mt-2">{featuredPost.summary}</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-600/60 text-white rounded-md hover:bg-pink-500/60 transition-all text-sm cursor-pointer"
                onClick={() => navigate(`/post/${featuredPost.postId}`)}
              >
                Read Featured
            </button>
          </motion.div>
        </div>
      )}

      {/* Trending */}
      {trendingPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {trendingPosts.map((post : Post) => (
            <motion.div
              key={post.postId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 p-4 rounded-xl border border-white/10 hover:bg-white/20 transition backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-white/80 mb-4" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                Trending 🔥
              </h3>
                <h4 className="text-lg font-semibold text-white" dir="auto" style={{ unicodeBidi: 'plaintext' }}>{post.title}</h4>
                <p className="text-sm text-white/60 mt-1 line-clamp-2" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                {post.content}
              </p>
              <button
                onClick={() => navigate(`/post/${post.postId}`)}
                className="mt-2 text-blue-400 hover:underline text-sm"
              >
                Read More →
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Other Posts */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        {otherPosts.map((post) => (
          <motion.div
            key={post.postId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-md hover:shadow-purple-700/40 hover:scale-[1.01] transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-purple-300" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
              {post.title}
            </h2>
            <p className="text-sm text-white/40 mt-1">
              {new Date(post.date).toDateString()}
            </p>
            <p className="text-white/80 mt-4 line-clamp-3" dir="auto" style={{ unicodeBidi: 'plaintext' }}>{post.content}</p>
            <button
              onClick={() => navigate(`/post/${post.postId}`)}
              className="mt-4 text-sm text-blue-400 hover:underline"
            >
              Read More →
            </button>

          </motion.div>
        ))}
      </div>

  {/* Removed Author Spotlight & Newsletter per request */}
    </main>
  );
}
