"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Monolith() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const monolithGeometry = useMemo(() => {
    // Tall faceted prism — hexagonal base, 6 radial segments gives clean architectural facets
    const geo = new THREE.CylinderGeometry(0.5, 0.7, 5, 6);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Very slow rotation — 1 full rotation every ~60s
      groupRef.current.rotation.y = t * 0.015;
      // Gentle bobbing — long period sine wave
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;
    }
    if (innerRef.current) {
      // Inner core rotates counter to outer shell
      innerRef.current.rotation.y = -t * 0.025;
      innerRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer monolith shell — dark obsidian glass */}
      <mesh geometry={monolithGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0a0a0f"
          metalness={0.85}
          roughness={0.12}
          transmission={0.25}
          thickness={2.5}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          ior={1.8}
          attenuationColor="#1a1a2e"
          attenuationDistance={3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner luminous core — subtle energy source */}
      <mesh ref={innerRef} scale={0.35}>
        <octahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#4ecdc4"
          emissive="#4ecdc4"
          emissiveIntensity={0.8}
          metalness={0.1}
          roughness={0.4}
          transmission={0.6}
          thickness={1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Top cap — gold accent ring */}
      <mesh position={[0, 2.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 16, 6]} />
        <meshStandardMaterial
          color="#c9a96e"
          metalness={1.0}
          roughness={0.2}
          emissive="#c9a96e"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -2.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.02, 16, 6]} />
        <meshStandardMaterial
          color="#c9a96e"
          metalness={1.0}
          roughness={0.2}
          emissive="#c9a96e"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function FloorPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshPhysicalMaterial
        color="#050508"
        metalness={0.9}
        roughness={0.25}
        clearcoat={0.8}
        clearcoatRoughness={0.15}
      />
    </mesh>
  );
}

function FloatingDebris() {
  const debrisRef = useRef<THREE.Group>(null);
  const count = 24;

  const debrisData = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      radius: 3 + Math.random() * 4,
      speed: 0.05 + Math.random() * 0.08,
      offset: (i / count) * Math.PI * 2,
      yOffset: (Math.random() - 0.5) * 6,
      scale: 0.02 + Math.random() * 0.04,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!debrisRef.current) return;
    debrisRef.current.children.forEach((child, i) => {
      const d = debrisData[i];
      const angle = t * d.speed + d.offset;
      child.position.x = Math.cos(angle) * d.radius;
      child.position.z = Math.sin(angle) * d.radius;
      child.position.y = d.yOffset + Math.sin(t * 0.3 + d.offset) * 0.5;
      child.rotation.x = t * 0.2 + d.offset;
      child.rotation.y = t * 0.15 + d.offset;
    });
  });

  return (
    <group ref={debrisRef}>
      {debrisData.map((_, i) => (
        <mesh key={i} scale={debrisData[i].scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function CinematicCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow orbital drift — camera orbits around origin at a distance
    const radius = 9;
    const height = 1.5 + Math.sin(t * 0.15) * 0.8;
    const angle = t * 0.04;

    const targetX = Math.cos(angle) * radius;
    const targetZ = Math.sin(angle) * radius;

    camera.position.x += (targetX - camera.position.x) * 0.008;
    camera.position.z += (targetZ - camera.position.z) * 0.008;
    camera.position.y += (height - camera.position.y) * 0.008;
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

function Scene() {
  return (
    <>
      {/* Ambient fill — very low, moody */}
      <ambientLight intensity={0.08} color="#a0c4ff" />

      {/* Key light — strong directional from upper right */}
      <directionalLight
        position={[8, 10, 5]}
        intensity={2.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Rim light — cool teal from behind left */}
      <spotLight
        position={[-8, 4, -6]}
        intensity={8}
        color="#4ecdc4"
        angle={0.4}
        penumbra={1}
        distance={30}
      />

      {/* Warm accent — amber from bottom right */}
      <pointLight
        position={[5, -3, 4]}
        intensity={3}
        color="#c9a96e"
        distance={20}
      />

      {/* Subtle purple fill from above */}
      <pointLight
        position={[0, 8, 0]}
        intensity={1.2}
        color="#8b5cf6"
        distance={25}
      />

      <fog attach="fog" args={["#050508", 12, 28]} />

      <Monolith />
      <FloorPlane />
      <FloatingDebris />
      <CinematicCamera />
    </>
  );
}

export default function MonolithScene() {
  return (
    <div className="w-full h-full fixed inset-0">
      <Canvas
        camera={{ position: [9, 1.5, 0], fov: 45 }}
        style={{ background: "#050508" }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}
