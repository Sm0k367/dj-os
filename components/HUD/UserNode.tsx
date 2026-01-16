'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import { User, ShieldAlert, ShieldCheck, LogOut, HardDrive } from 'lucide-react';
import AuthModal from '../Auth/AuthModal';

export default function UserNode() {
  const { user, dna_xp, profile, setAuth } = useStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // 1. Check if Supabase is actually configured
  useEffect(() => {
    const checkConnectivity = async () => {
      // If supabase is a Proxy (from our previous file change), this will fail silently
      try {
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (sbUser) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sbUser.id)
            .single();
          setAuth(sbUser, prof);
          setIsOnline(true);
        }
      } catch (e) {
        setIsOnline(false);
      }
    };
    checkConnectivity();
  }, [setAuth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setAuth(null, null);
    window.location.reload();
  };

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-auto">
      <div 
        className="glass-panel p-2 pr-4 rounded-full flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all"
        onClick={() => !user && setIsAuthOpen(true)}
      >
        {/* AVATAR / ICON */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${user ? 'border-neon shadow-[0_0_10px_#00f2ff]' : 'border-white/20'}`}>
          {user ? (
            <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} alt="User" className="w-8 h-8" />
          ) : (
            <User size={18} className="text-white/40" />
          )}
        </div>

        {/* IDENTITY INFO */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {user ? (profile?.username || 'ARCHITECT') : 'LOCAL_GUEST'}
            </span>
            {isOnline ? (
              <ShieldCheck size={10} className="text-neon" title="Cloud Synced" />
            ) : (
              <HardDrive size={10} className="text-amber-500" title="Local Storage Mode" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((dna_xp % 100), 100)}%` }}
                className="h-full bg-neon" 
              />
            </div>
            <span className="text-[8px] text-neon font-mono">XP: {dna_xp}</span>
          </div>
        </div>

        {user && (
          <button 
            onClick={(e) => { e.stopPropagation(); handleSignOut(); }}
            className="ml-2 p-2 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
