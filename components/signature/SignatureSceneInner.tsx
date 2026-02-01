"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

// Main mesh with transmission effect
function DataMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0005;
      meshRef.current.rotation.y += 0.001;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={2}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Inner glowing sphere */}
      <mesh position={[0, 0, 0]} scale={1.2}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Particle nodes orbiting the central mesh
function DataNodes({ count = 60 }: { count?: number }) {
  const nodesRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const nodes: Array<any> = [];
    const layers = 5;
    const nodesPerLayer = Math.floor(count / layers);

    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        const angle = (i / nodesPerLayer) * Math.PI * 2;
        const radius = 4 + layer * 0.8;
        const y = (layer - 2) * 0.8;

        nodes.push({
          position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [
            number,
            number,
            number,
          ],
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
    const points: THREE.Vector3[] = [];
    const gridSize = 8;
    const spacing = 1.5;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing;
        const z = (j - gridSize / 2) * spacing;
        const y = Math.sin(i + j) * 0.5;

        if (i < gridSize - 1) {
          points.push(new THREE.Vector3(x, y, z));
          points.push(
            new THREE.Vector3(x + spacing, Math.sin(i + 1 + j) * 0.5, z),
          );
        }
        if (j < gridSize - 1) {
          points.push(new THREE.Vector3(x, y, z));
          points.push(
            new THREE.Vector3(x, Math.sin(i + j + 1) * 0.5, z + spacing),
          );
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
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.08}
        />
      </Sphere>
      <Sphere args={[5.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.05}
        />
      </Sphere>
    </>
  );
}

export default function SignatureSceneInner({
  isInteracting,
}: {
  isInteracting: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#000000"]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight
        position={[0, 15, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        color="#a855f7"
      />

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
  );
}
