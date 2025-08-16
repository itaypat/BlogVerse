import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  // const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<any>(null);

  // Dynamically load Quill (JS + CSS) only once; no package install needed
  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window === "undefined") return;
      if ((window as any).Quill) {
        initQuill();
        return;
      }
      // Inject CSS
      if (!document.getElementById("quill-css")) {
        const link = document.createElement("link");
        link.id = "quill-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css";
        document.head.appendChild(link);
      }
      // Inject dark override styles (only once)
      if (!document.getElementById("quill-dark-style")) {
        const style = document.createElement("style");
        style.id = "quill-dark-style";
        style.innerHTML = `
          .ql-snow .ql-toolbar { background:#1e293b; border:1px solid #334155; color:#e2e8f0; }
          .ql-snow .ql-toolbar button svg { filter: brightness(0.85); }
          .ql-snow .ql-toolbar button:hover svg { filter: brightness(1); }
          .ql-snow .ql-container { border:1px solid #334155; }
          .ql-container.ql-snow { background:#0f172a; }
          .ql-editor { min-height:200px; color:#f1f5f9; line-height:1.55; }
          .ql-editor.ql-blank::before { color:#64748b; font-style: italic; }
          .ql-snow .ql-stroke { stroke:#e2e8f0; }
          .ql-snow .ql-fill { fill:#e2e8f0; }
          .ql-snow .ql-picker { color:#e2e8f0; }
          .ql-snow .ql-picker-options { background:#1e293b; border:1px solid #334155; }
          .ql-snow .ql-picker.ql-expanded .ql-picker-label { color:#fff; }
          .ql-snow .ql-tooltip { background:#1e293b; border:1px solid #334155; color:#e2e8f0; }
          .ql-snow .ql-tooltip input { background:#0f172a; border:1px solid #334155; color:#e2e8f0; }
          .ql-direction-rtl { direction: rtl; text-align: right; }
          .ql-direction-ltr { direction: ltr; text-align: left; }
        `;
        document.head.appendChild(style);
      }
      // Inject Script
      const scriptId = "quill-js";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js";
        script.async = true;
        script.onload = () => initQuill();
        script.onerror = () => console.error("Failed to load Quill from CDN");
        document.body.appendChild(script);
      } else {
        initQuill();
      }
    };

    const initQuill = () => {
      if (quillInstance.current || !(window as any).Quill || !editorRef.current) return;
      const Quill = (window as any).Quill;
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }, { direction: 'rtl' }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ];
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your post content here...",
        modules: { toolbar: toolbarOptions },
      });
      quillInstance.current.on("text-change", () => {
        const html = quillInstance.current.root.innerHTML;
        setContent(html);
        autoDetectDirection();
      });
      autoDetectDirection();
    };

    loadQuill();
  }, []);

  // Detect if most characters (first 40) are Hebrew and set direction accordingly
  const autoDetectDirection = () => {
    if (!quillInstance.current) return;
    const text = quillInstance.current.getText().slice(0, 60);
    const hebrewMatches = text.match(/[\u0590-\u05FF]/g) || [];
    const isHebrew = hebrewMatches.length > 3; // threshold
    const root: HTMLElement = quillInstance.current.root;
    if (isHebrew) {
      root.setAttribute('dir', 'rtl');
      root.classList.add('ql-direction-rtl');
      root.classList.remove('ql-direction-ltr');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.add('ql-direction-ltr');
      root.classList.remove('ql-direction-rtl');
    }
  };
  

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
          <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-teal-500/20 to-sky-500/20 blur-2xl opacity-60 animate-pulse" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Content</label>
                <div className="rounded-md overflow-hidden border border-white/10 bg-slate-900/60">
                  <div
                    ref={editorRef}
                    className="quill-editor min-h-[200px]"
                    style={{ background: "transparent" }}
                  />
                </div>
                <p className="text-xs text-white/40">Rich text enabled. Hebrew detected automatically (RTL). Use toolbar direction button if needed.</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-sky-500 hover:from-cyan-500 hover:to-teal-600 text-white font-bold shadow-md transition-all duration-300"
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
