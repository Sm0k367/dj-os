'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Suspense } from 'react';

export default function NeuralCanvas() {
  return (
    <div className="fixed inset-0 bg-black">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 2]} // Optimizes performance for high-res screens
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
          
          {/* Central Neural Core (Example 3D Object) */}
          <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 64, 64]}>
              <MeshDistortMaterial
                color="#00f2ff"
                speed={3}
                distort={0.4}
                radius={1}
                emissive="#0066ff"
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.8}
              />
            </Sphere>
          </Float>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            makeDefault 
          />
        </Canvas>
      </Suspense>
      
      {/* Overlay Gradient for "OS" feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
