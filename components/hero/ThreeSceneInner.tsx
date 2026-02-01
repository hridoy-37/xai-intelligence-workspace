"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Points,
  PointMaterial,
  Environment,
  PerspectiveCamera,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { useTransform } from "framer-motion";

// Advanced particle system with implosion effect
const DataParticleField: React.FC<{ count: number; scrollYProgress: any }> = ({
  count,
  scrollYProgress,
}) => {
  const points = useRef<THREE.Group>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create spherical distribution
      const radius = 50 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Color variation
      const colorIntensity = 0.5 + Math.random() * 0.5;
      colors[i * 3] = 0.4 * colorIntensity;
      colors[i * 3 + 1] = 0.4 * colorIntensity;
      colors[i * 3 + 2] = 0.9 * colorIntensity;
    }

    return { positions: pos, colors };
  }, [count]);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0]);
  const implodeScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.3, 0.01],
  );

  useFrame((state) => {
    if (points.current) {
      const time = state.clock.getElapsedTime();
      points.current.rotation.y = time * 0.03;
      points.current.rotation.x = Math.sin(time * 0.02) * 0.1;

      const scale = implodeScale.get();
      points.current.scale.setScalar(scale);

      // Pulsating effect
      const pulse = Math.sin(time * 0.5) * 0.1 + 0.9;
      const child = points.current.children[0] as THREE.Points;
      if (child && child.material) {
        (child.material as THREE.Material).opacity = opacity.get() * pulse;
      }
    }
  });

  return (
    <group ref={points}>
      <Points
        positions={positions.positions}
        colors={positions.colors}
        stride={3}
      >
        <PointMaterial
          transparent
          vertexColors
          size={0.2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </Points>
    </group>
  );
};

// Morphing central geometry
const CentralGeometry: React.FC<{ scrollYProgress: any }> = ({
  scrollYProgress,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 2.5, 5]);
  const rotationSpeed = useTransform(scrollYProgress, [0, 1], [0.2, 2]);
  const complexity = useTransform(scrollYProgress, [0, 1], [0, 2]);

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      const time = state.clock.getElapsedTime();

      // Complex rotation
      meshRef.current.rotation.y = time * rotationSpeed.get();
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.3;
      meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.2;

      // Scale based on scroll
      groupRef.current.scale.setScalar(scale.get());

      // Morphing effect
      const morphAmount = complexity.get();
      meshRef.current.scale.x = 1 + Math.sin(time) * 0.2 * morphAmount;
      meshRef.current.scale.y = 1 + Math.cos(time * 1.3) * 0.2 * morphAmount;
      meshRef.current.scale.z = 1 + Math.sin(time * 0.7) * 0.2 * morphAmount;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          transmission={0.95}
          roughness={0.2}
          thickness={2}
          ior={1.5}
          chromaticAberration={0.15}
          anisotropy={0.5}
          distortion={0.3}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#6366f1"
          transparent
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh scale={0.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
        <pointLight intensity={50} distance={30} color="#6366f1" decay={2} />
      </mesh>
    </group>
  );
};

// Data connection lines
const ConnectionLines: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null!);

  const geometry = useMemo(() => {
    const points = [];
    const numLines = 20;

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const radius = 15;
      points.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 2) * 5,
          Math.sin(angle) * radius,
        ),
      );
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={linesRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

// Main 3D Scene
const Scene3D: React.FC<{ scrollYProgress: any }> = ({ scrollYProgress }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={40} />
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.3} />
      <spotLight
        position={[30, 30, 30]}
        intensity={1.5}
        angle={0.2}
        penumbra={1}
        color="#6366f1"
      />
      <spotLight
        position={[-30, -30, -30]}
        intensity={0.8}
        angle={0.2}
        penumbra={1}
        color="#8b5cf6"
      />

      <Environment preset="night" />

      <DataParticleField count={2000} scrollYProgress={scrollYProgress} />
      <CentralGeometry scrollYProgress={scrollYProgress} />
      <ConnectionLines />

      {/* Post-processing would go here in production */}
    </>
  );
};

export default function ThreeSceneInner({
  scrollYProgress,
}: {
  scrollYProgress: any;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      performance={{ min: 0.5 }}
    >
      <Scene3D scrollYProgress={scrollYProgress} />
    </Canvas>
  );
}
