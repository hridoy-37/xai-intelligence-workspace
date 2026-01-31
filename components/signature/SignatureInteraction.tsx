"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Advanced 3D Mesh with dynamic distortion
function DataMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    meshRef.current.rotation.y = time * 0.05;
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    
    const scale = hovered ? 1.1 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[2.5, 128, 128]} />
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.6}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Particle nodes orbiting the central mesh
function DataNodes({ count = 60 }: { count?: number }) {
  const nodesRef = useRef<THREE.Group>(null);
  
  const positions = useMemo(() => {
    const nodes = [];
    const layers = 5;
    const nodesPerLayer = Math.floor(count / layers);
    
    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        const angle = (i / nodesPerLayer) * Math.PI * 2;
        const radius = 4 + layer * 0.8;
        const y = (layer - 2) * 0.8;
        
        nodes.push({
          position: [
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          color: layer % 2 === 0 ? "#6366f1" : "#8b5cf6",
          size: 0.08 + Math.random() * 0.04,
        });
      }
    }
    
    return nodes;
  }, [count]);

  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={nodesRef}>
      {positions.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Connection lines between nodes
function ConnectionGrid() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const points = [];
    const gridSize = 8;
    const spacing = 1.5;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing;
        const z = (j - gridSize / 2) * spacing;
        const y = Math.sin(i + j) * 0.5;
        
        if (i < gridSize - 1) {
          points.push(new THREE.Vector3(x, y, z));
          points.push(new THREE.Vector3(x + spacing, Math.sin(i + 1 + j) * 0.5, z));
        }
        if (j < gridSize - 1) {
          points.push(new THREE.Vector3(x, y, z));
          points.push(new THREE.Vector3(x, Math.sin(i + j + 1) * 0.5, z + spacing));
        }
      }
    }
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.elapsedTime;
      linesRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry} position={[0, -3, 0]}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
    </lineSegments>
  );
}

// Wireframe sphere
function WireframeSphere() {
  return (
    <>
      <Sphere args={[4.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.08} />
      </Sphere>
      <Sphere args={[5.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.05} />
      </Sphere>
    </>
  );
}

export default function SignatureInteraction() {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <section className="relative py-32 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-10">
              3D Visualization
            </span>
            
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">
              <span className="text-white">Interactive</span>
              <br />
              <span className="text-gradient-primary">Data Mesh</span>
            </h2>
            
            <p className="text-xl text-zinc-400 leading-relaxed mb-10">
              Real-time 3D visualization of your data topology. Watch as relationships form, 
              patterns emerge, and insights crystallize through interactive exploration powered by WebGL.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  60+
                </div>
                <div className="text-sm text-zinc-500 font-bold uppercase tracking-wider">
                  Data Nodes
                </div>
              </div>
              <div>
                <div className="text-5xl font-black mb-3 bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  5
                </div>
                <div className="text-sm text-zinc-500 font-bold uppercase tracking-wider">
                  Hierarchy Levels
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm font-mono text-indigo-400">
                Interactive
              </div>
              <div className="px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm font-mono text-purple-400">
                Real-time
              </div>
              <div className="px-6 py-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-sm font-mono text-pink-400">
                WebGL
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm uppercase tracking-wider rounded-full transition-all shadow-xl hover:shadow-indigo-500/50"
            >
              Explore in 3D
            </motion.button>
          </motion.div>
          
          {/* Right 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[700px] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <Canvas
              camera={{ position: [0, 0, 12], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <color attach="background" args={['#000000']} />
              
              {/* Lighting */}
              <ambientLight intensity={0.2} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
              <spotLight position={[0, 15, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#a855f7" />
              
              {/* 3D Objects */}
              <DataMesh />
              <DataNodes count={60} />
              <WireframeSphere />
              <ConnectionGrid />
              
              {/* Controls */}
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!isInteracting}
                autoRotateSpeed={0.5}
                minDistance={8}
                maxDistance={20}
                dampingFactor={0.05}
              />
            </Canvas>
            
            {/* Status Indicator */}
            <div className="absolute top-6 left-6 bg-black/90 backdrop-blur-sm border border-zinc-800 rounded-xl px-6 py-4">
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
                Status
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-mono text-green-400">Rendering Live</span>
              </div>
            </div>
            
            {/* Controls Guide */}
            <div className="absolute bottom-6 right-6 bg-black/90 backdrop-blur-sm border border-zinc-800 rounded-xl px-6 py-4">
              <div className="text-xs text-zinc-500 font-mono space-y-1">
                <div>← → Rotate • ↑ ↓ Zoom</div>
                <div>Drag to orbit • Scroll to zoom</div>
              </div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Interaction indicator */}
            {isInteracting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 right-6 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-2"
              >
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Interacting
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Ambient Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}
