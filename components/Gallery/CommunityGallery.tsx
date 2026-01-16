'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { Heart, Zap, X, Search, WifiOff } from 'lucide-react';

// Procedural Mock Data for Offline Mode
const MOCK_POSTERS = [
  { id: 'm1', track_name: 'BLUE_MONEY', realm_type: 0, image_url: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=800&q=80', likes_count: 128, profiles: { username: 'SYSTEM_ARCHITECT' } },
  { id: 'm2', track_name: 'RESONANCE', realm_type: 2, image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', likes_count: 85, profiles: { username: 'NEURAL_NODE_01' } },
  { id: 'm3', track_name: 'OS_FUNK', realm_type: 5, image_url: 'https://images.unsplash.com/photo-1635776062127-d323af9a03e9?auto=format&fit=crop&w=800&q=80', likes_count: 242, profiles: { username: 'VOID_WALKER' } },
];

export default function CommunityGallery({ onClose }: { onClose: () => void }) {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { setRealm, setTrack } = useStore();

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const { data, error } = await supabase
          .from('posters')
          .select(`*, profiles (username, avatar_url)`)
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) throw new Error('Offline');
        setPosters(data);
      } catch (err) {
        // Fallback to Mocks if DB fails or is empty
        setPosters(MOCK_POSTERS);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  const handleRemix = (poster: any) => {
    setRealm(poster.realm_type, poster.track_name);
    setTrack({ id: poster.id, title: poster.track_name, url: '' });
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col p-8"
    >
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-glow uppercase flex items-center gap-4">
            Archive_Stream {isOffline && <WifiOff className="text-amber-500" size={20} />}
          </h2>
          <p className="text-[10px] text-neon font-mono uppercase tracking-[0.3em]">
            {isOffline ? 'Viewing_Local_Cache_Mode' : 'Syncing_Live_Multiverse'}
          </p>
        </div>
        <button onClick={onClose} className="glass-panel p-4 rounded-full hover:bg-white/10 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posters.map((poster, i) => (
            <motion.div 
              key={poster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl overflow-hidden group relative"
            >
              <div className="aspect-[9/16] relative bg-white/5">
                <img src={poster.image_url} alt="DNA" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                  <button 
                    onClick={() => handleRemix(poster)}
                    className="w-full bg-neon text-black font-bold py-3 rounded text-[10px] uppercase flex items-center justify-center gap-2"
                  >
                    <Zap size={14} fill="black" /> Remix_Geometry
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-white/5">
                <h3 className="text-[10px] font-bold truncate">{poster.track_name}</h3>
                <p className="text-[8px] opacity-40 font-mono">NODE: {poster.profiles?.username}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
