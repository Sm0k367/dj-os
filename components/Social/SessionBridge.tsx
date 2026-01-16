'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { Users, Radio, Activity } from 'lucide-react';

export default function SessionBridge({ sessionId = 'global-vault' }) {
  const { setTrack, setRealm, currentTrack, realmType, isPlaying } = useStore();
  const [peerCount, setPeerCount] = useState(0);

  useEffect(() => {
    // 1. Initialize the Realtime Channel
    const channel = supabase.channel(sessionId, {
      config: { presence: { key: 'user' } }
    });

    // 2. Listen for Broadcast Events (Syncing Visuals/Audio)
    channel
      .on('broadcast', { event: 'sync_state' }, ({ payload }) => {
        if (payload.track.id !== currentTrack?.id) {
          setTrack(payload.track);
        }
        if (payload.realm !== realmType) {
          setRealm(payload.realm, payload.track.title);
        }
      })
      // 3. Presence Tracking (Who's online?)
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

  // 4. Broadcast local changes to the group (Only if playing)
  useEffect(() => {
    if (isPlaying) {
      const channel = supabase.channel(sessionId);
      channel.send({
        type: 'broadcast',
        event: 'sync_state',
        payload: { track: currentTrack, realm: realmType }
      });
    }
  }, [currentTrack, realmType, isPlaying, sessionId]);

  return (
    <div className="fixed bottom-32 left-6 z-40 pointer-events-none">
      <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 animate-pulse">
        <div className="relative">
          <Radio size={14} className="text-neon" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-neon uppercase tracking-tighter">Live_Sync</span>
          <span className="text-[8px] text-white/40 uppercase font-mono">{peerCount} Nodes_Connected</span>
        </div>
      </div>
    </div>
  );
}
