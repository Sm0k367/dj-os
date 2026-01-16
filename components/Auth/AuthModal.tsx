'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { User, Lock, Mail, X, Fingerprint } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else if (data.user) {
      setAuth(data.user, null); // Profile will be fetched via hook/effect later
      onClose();
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="glass-panel w-full max-w-md p-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-neon/30 overflow-hidden">
              {loading && <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1/2 h-full bg-neon" />}
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={20}/></button>

            <div className="text-center mb-8">
              <Fingerprint className="mx-auto text-neon mb-4" size={40} />
              <h2 className="text-xl font-bold tracking-widest uppercase">Neural_Identity</h2>
              <p className="text-[10px] text-white/40 mt-1 uppercase">Establish encrypted link to Vault</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input 
                  type="email" placeholder="EMAIL_ADDRESS" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs focus:border-neon outline-none transition-all font-mono"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input 
                  type="password" placeholder="ACCESS_KEY" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs focus:border-neon outline-none transition-all font-mono"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-neon text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Authenticate' : 'Initialize Profile'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] text-white/40 uppercase hover:text-neon transition-colors"
              >
                {isLogin ? "No identity detected? Create New" : "Identity exists? Return to Login"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
