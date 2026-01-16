'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import { User, ShieldAlert, ShieldCheck, LogOut } from 'lucide-react';
import AuthModal from '../Auth/AuthModal';

export default function UserNode() {
  const { user, profile, setAuth } = useStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync Auth State on Load
  useEffect(() => {
    const syncUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile data (XP, Stats)
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setAuth(user, prof);
      }
    };
    syncUser();
  }, [setAuth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuth(null, null);
    window.location.reload(); // Hard reset for security
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
              {user ? (profile?.username || 'ARCHITECT') : 'GUEST_USER'}
            </span>
            {user ? <ShieldCheck size={10} className="text-neon" /> : <ShieldAlert size={10} className="text-red-500" />}
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-neon w-[65%]" /> {/* Static XP bar for now */}
              </div>
              <span className="text-[8px] text-neon font-mono">XP: {profile?.dna_xp || 0}</span>
            </div>
          ) : (
            <span className="text-[8px] text-white/20 uppercase">Auth_Required</span>
          )}
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
