'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { generateRealmPoints } from '@/lib/realmCalculations';

function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const { realmType, dnaSeed, analyser, isPlaying } = useStore();
  
  // 1. Generate the initial positions based on the Realm Type
  const seedInt = parseInt(dnaSeed.replace('0x', ''), 16) || 0;
  const positions = useMemo(() => 
    generateRealmPoints(realmType, 15000, seedInt), 
    [realmType, seedInt]
  );

  // 2. The Animation Loop (60-120fps)
  useFrame((state) => {
    if (!pointsRef.current) return;

    // Smooth Rotation
    pointsRef.current.rotation.y += 0.001;
    pointsRef.current.rotation.z += 0.0005;

    // Audio Reactivity
    if (isPlaying && analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      // Get bass intensity (lower frequencies)
      const bass = dataArray[2] / 255; 
      const mid = dataArray[10] / 255;
      
      // Scale particles based on bass
      const scale = 1 + bass * 0.15;
      pointsRef.current.scale.set(scale, scale, scale);
      
      // Subtle "breathing" effect based on mids
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime) * (mid * 20);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={new THREE.Color().setHSL((seedInt % 360) / 360, 0.8, 0.5)}
        size={3}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function NeuralCanvas() {
  return (
    <div id="world-canvas-container" className="fixed inset-0 bg-black">
      <Canvas
        camera={{ position: [0, 0, 1000], fov: 75 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 500, 2500]} />
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
