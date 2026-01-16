'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { Radio, Loader2, HardDrive } from 'lucide-react';

export default function SessionBridge({ sessionId = 'global-vault' }) {
  const { setTrack, setRealm, currentTrack, realmType, isPlaying } = useStore();
  const [peerCount, setPeerCount] = useState(0);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    // 1. Safety Check: If supabase is our Proxy object, abort Realtime
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setIsConfigured(false);
      return;
    }

    const channel = supabase.channel(sessionId, {
      config: { presence: { key: 'user' } }
    });

    channel
      .on('broadcast', { event: 'sync_state' }, ({ payload }) => {
        if (payload.track.id !== currentTrack?.id) setTrack(payload.track);
        if (payload.realm !== realmType) setRealm(payload.realm, payload.track.title);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPeerCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => { channel.unsubscribe(); };
  }, [sessionId, currentTrack, realmType, setTrack, setRealm]);

  // Only broadcast if we have a valid connection
  useEffect(() => {
    if (isPlaying && isConfigured) {
      const channel = supabase.channel(sessionId);
      channel.send({
        type: 'broadcast',
        event: 'sync_state',
        payload: { track: currentTrack, realm: realmType }
      });
    }
  }, [currentTrack, realmType, isPlaying, sessionId, isConfigured]);

  return (
    <div className="fixed bottom-32 left-6 z-40 pointer-events-none">
      <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3">
        {isConfigured ? (
          <>
            <div className="relative">
              <Radio size={14} className="text-neon animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-neon uppercase tracking-tighter">Live_Sync</span>
              <span className="text-[8px] text-white/40 uppercase font-mono">{peerCount} Nodes_Active</span>
            </div>
          </>
        ) : (
          <>
            <HardDrive size={14} className="text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Local_Engine</span>
              <span className="text-[8px] text-white/40 uppercase font-mono">Cloud_Link_Inactive</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
