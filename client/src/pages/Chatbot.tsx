import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [groundWithPosts, setGroundWithPosts] = useState(true); // toggle for grounding mode
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user', content: text } as ChatMessage];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
  const res = await axiosInstance.post('/chat/complete', { messages: next, groundWithPosts });
      const reply = (res.data?.content as string) ?? '';
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: 'Sorry, I had trouble contacting the chat service.' }]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col w-full">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-2 gap-4">
        <h2 className="text-lg font-semibold text-white">Chatbot</h2>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <span className={!groundWithPosts ? 'font-semibold text-white' : ''}>General</span>
          <button
            type="button"
            onClick={() => setGroundWithPosts(g => !g)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-xs ${groundWithPosts ? 'bg-gradient-to-r from-teal-600 to-sky-500' : 'bg-white/20'}`}
            aria-pressed={groundWithPosts}
            aria-label="Toggle grounding with blog posts"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${groundWithPosts ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span className={groundWithPosts ? 'font-semibold text-white' : ''}>Blog Posts</span>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex-1 overflow-y-auto space-y-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
        {messages
          .filter(m => m.role !== 'system')
          .map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap ${m.role === 'user' ? 'ml-auto bg-gradient-to-r from-teal-600/40 to-sky-500/40' : 'mr-auto bg-white/10'} border border-white/10 text-white`}
              dir="auto"
              style={{ unicodeBidi: 'plaintext' }}
            >
              {m.content}
            </motion.div>
          ))}
        <div ref={endRef} />
  </div>

  <div className="mt-4 flex gap-2 w-full max-w-4xl mx-auto">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask the assistant…"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
  <Button onClick={send} disabled={loading} className="bg-gradient-to-r from-teal-600 to-sky-500 text-white">
          {loading ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
