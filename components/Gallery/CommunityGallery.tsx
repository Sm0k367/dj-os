'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { Heart, Share2, Zap, X, Search } from 'lucide-react';

export default function CommunityGallery({ onClose }: { onClose: () => void }) {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setRealm, setTrack } = useStore();

  useEffect(() => {
    const fetchPosters = async () => {
      const { data, error } = await supabase
        .from('posters')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (!error) setPosters(data);
      setLoading(false);
    };

    fetchPosters();
  }, []);

  const handleRemix = (poster: any) => {
    // Inject the poster's DNA back into the live engine
    setRealm(poster.realm_type, poster.track_name);
    setTrack({ title: poster.track_name, url: '', id: 'remix' }); // Triggers morph
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[200] bg-matrix-black/95 backdrop-blur-2xl flex flex-col p-8"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-glow uppercase">Community_Archive</h2>
          <p className="text-[10px] text-neon font-mono uppercase tracking-[0.3em]">Exploring the collective multiverse</p>
        </div>
        <button onClick={onClose} className="glass-panel p-4 rounded-full hover:bg-white/10 transition-all">
          <X size={24} />
        </button>
      </div>

      {/* SEARCH / FILTER BAR */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" placeholder="SEARCH_BY_DNA_OR_TRACK..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-mono outline-none focus:border-neon transition-all"
          />
        </div>
      </div>

      {/* MASONRY GRID */}
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-neon animate-pulse font-mono uppercase">Syncing_Records...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posters.map((poster, i) => (
              <motion.div 
                key={poster.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl overflow-hidden group relative"
              >
                {/* POSTER IMAGE */}
                <div className="aspect-[9/16] relative overflow-hidden bg-black/40">
                  <img src={poster.image_url} alt="DNA" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* OVERLAY ON HOVER */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <button 
                      onClick={() => handleRemix(poster)}
                      className="w-full bg-neon text-black font-bold py-3 rounded-lg text-[10px] uppercase flex items-center justify-center gap-2 mb-2"
                    >
                      <Zap size={12} fill="black" /> Remix Realm
                    </button>
                  </div>
                </div>

                {/* METADATA */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold truncate w-40">{poster.track_name.toUpperCase()}</h3>
                      <p className="text-[9px] text-white/40 font-mono">BY: {poster.profiles?.username || 'ANON'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-neon">
                      <Heart size={12} fill={poster.likes_count > 0 ? "currentColor" : "none"} />
                      <span className="text-[10px]">{poster.likes_count}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
