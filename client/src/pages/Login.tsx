// src/pages/LoginPage.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const { login } =  useAuth();

    const handleLogin = async (e : any) => {
       e.preventDefault();
        setLoading(true);

        try {
          const success = await login(email, password); // your custom login function
          if (success) {
            navigate('/'); // navigate only on success
          }
        } 
        catch (error :any) {
          console.error(error);
          alert(error.response?.data?.message || "Login error occurred");
        } 
        finally {
          setLoading(false);
        }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 relative">
          <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-60 animate-pulse" />
          <CardContent className="z-10 relative">
            <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-widest">
              LOGIN
            </h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/20 text-white placeholder:text-white/40"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border border-white/20 text-white placeholder:text-white/40"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-md transition-all duration-300"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <p className="text-sm text-white/50 mt-4 text-center">
              Don’t have an account?{" "}
              <span
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Register
              </span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
