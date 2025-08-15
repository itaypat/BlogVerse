import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  // const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (!title.trim() || !content.trim()) {
    alert("Please fill in both the title and content fields.");
    return;
  }

  try {
    const res = await axiosInstance.post("/post/add", {
      title,
      content,
      isPublished: true,
    });

    if (res.data) {
      navigate("/");
      // alert("Post added successfully!");
    }
  } catch (error) {
    console.error("Failed to add post:", error);
    alert("Something went wrong while adding the post.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 sm:px-6 py-10 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <Card className="relative backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl">
          <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-60 animate-pulse" />
          <CardContent className="relative z-10 p-4 sm:p-8 space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
              Create a New Post
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border border-white/20 text-white placeholder:text-white/40"
              />

              {/* <Input
                type="text"
                placeholder="Cover Image URL (optional)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="bg-white/5 border border-white/20 text-white placeholder:text-white/40"
              /> */}

              <Textarea
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-white/5 border border-white/20 text-white placeholder:text-white/40"
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-md transition-all duration-300"
              >
                Publish Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
