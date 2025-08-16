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
  contentText?: string;
}

export default function AllPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    | "newest"
    | "oldest"
    | "title-asc"
    | "title-desc"
    | "author-asc"
    | "author-desc"
  >("newest"); // default newest to oldest

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

  const displayedPosts = useMemo(() => {
    // Filter
    const q = search.trim().toLowerCase();
    let list = !q
      ? [...posts]
      : posts.filter((p) => {
          const title = p.title?.toLowerCase() ?? "";
            const content = p.content?.toLowerCase() ?? "";
          const author = p.author?.toLowerCase() ?? "";
          const summary = p.summary?.toLowerCase() ?? "";
          return (
            title.includes(q) ||
            content.includes(q) ||
            author.includes(q) ||
            summary.includes(q)
          );
        });

    // Sort
    const safeDate = (d?: string) => {
      const t = d ? new Date(d).getTime() : 0;
      return isNaN(t) ? 0 : t;
    };

    list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return safeDate(b.date) - safeDate(a.date); // desc
        case "oldest":
          return safeDate(a.date) - safeDate(b.date); // asc
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" });
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "", undefined, { sensitivity: "base" });
        case "author-asc":
          return (a.author || "").localeCompare(b.author || "", undefined, { sensitivity: "base" });
        case "author-desc":
          return (b.author || "").localeCompare(a.author || "", undefined, { sensitivity: "base" });
        default:
          return 0;
      }
    });

    return list;
  }, [posts, search, sortBy]);

  function stripHtml(html?: string) {
    if (!html) return "";
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

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
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500">
          All Posts
        </h1>
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title, content, or author"
              className="pl-9 pr-10 bg-white/10 border-white/20 text-white placeholder-white/50"
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

          {/* Sort Menu */}
          <div className="w-full md:w-auto">
            <label className="sr-only" htmlFor="sortBy">Sort posts</label>
            <div className="relative w-full md:w-48">
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="themed-select w-full pr-8"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title-asc">Title A → Z</option>
                <option value="title-desc">Title Z → A</option>
                <option value="author-asc">Author A → Z</option>
                <option value="author-desc">Author Z → A</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-xs">▼</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-500 text-white text-sm hover:from-cyan-500 hover:to-teal-600 transition whitespace-nowrap"
          >
            Create New Note
          </button>
        </div>
      </div>

      {displayedPosts.length === 0 ? (
        <div className="text-white/70">
          {posts.length === 0
            ? "No posts yet. Be the first to create one!"
            : "No posts match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post) => (
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
              <h2 className="text-xl font-semibold text-teal-300 mb-1" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                {post.title}
              </h2>
              <p className="text-xs text-white/40 mb-3">
                {post.date ? new Date(post.date).toDateString() : ""}
              </p>
              <p className="text-white/80 line-clamp-3" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
                  {(post.summary || post.contentText || stripHtml(post.content))
                    .slice(0, 180)}
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
