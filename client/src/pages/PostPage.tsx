import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";

// Define the shape of your post object
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  coverImage?: string;
  createdAt: string;
}

export default function PostPage() {

  const navigate = useNavigate();


  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [authorData, setAuthorData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axiosInstance.get(`/post/${id}`)
        setPost(response.data);

        const authorResponse = await axiosInstance.get(`/user/${response.data.authorId}`);
        setAuthorData(authorResponse.data)
      } catch (error) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;
  if (!post) return <div className="text-white p-6">No post found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 sm:px-6 py-10 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="relative backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-emerald-400/10 via-teal-500/10 to-sky-500/10 blur-xl opacity-60 animate-pulse" />

          <CardContent className="relative z-10 p-4 sm:p-8 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
              {post.title}
            </h1>

            <div className="text-sm text-white/60">
              By <span className="text-blue-400 cursor-pointer" onClick={()=> navigate(`/profile/${authorData.userId}`)}>{authorData.name}</span> ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="Cover"
                className="w-full rounded-xl border border-white/20 mt-4"
              />
            )}

            <div className="prose prose-invert prose-p:text-white prose-headings:text-blue-300 max-w-none text-white" dir="auto" style={{ unicodeBidi: 'plaintext' }}>
              <div dir="auto" style={{ unicodeBidi: 'plaintext' }} dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
