"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 900;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const ring = Math.random() ** 0.45;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * ring * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = Math.sin(angle) * ring * 24 - 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.012;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#34d399" transparent opacity={0.42} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Monolith() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.08) * 0.14;
    group.current.position.y = Math.sin(t * 0.22) * 0.18;
  });

  return (
    <group ref={group} position={[4.8, -0.1, -7]} rotation={[0.1, -0.2, 0.03]}>
      <mesh>
        <boxGeometry args={[1.55, 4.8, 0.62]} />
        <meshStandardMaterial color="#06110d" emissive="#064e3b" emissiveIntensity={0.22} roughness={0.52} metalness={0.78} transparent opacity={0.86} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.58, 4.85, 0.65)]} />
        <lineBasicMaterial color="#34d399" transparent opacity={0.34} />
      </lineSegments>
    </group>
  );
}

function DataRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = t * 0.03;
    ref.current.rotation.y = t * 0.018;
  });

  return (
    <group ref={ref} position={[0, 0, -10]}>
      {[6, 9, 12].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2 + i * 0.08, 0, 0]}>
          <torusGeometry args={[radius, 0.008, 8, 180]} />
          <meshBasicMaterial color={i === 1 ? "#10b981" : "#e5fff5"} transparent opacity={i === 1 ? 0.09 : 0.045} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#030506"]} />
      <ambientLight intensity={0.22} />
      <pointLight position={[4, 3, 2]} intensity={6} color="#10b981" />
      <pointLight position={[-5, -2, -3]} intensity={2} color="#ecfeff" />
      <ParticleField />
      <DataRings />
      <Monolith />
      <fog attach="fog" args={["#030506", 10, 34]} />
    </>
  );
}

export default function AtmosphereScene() {
  return (
    <div className="fixed inset-0 z-0 opacity-90">
      <Canvas camera={{ position: [0, 0, 8], fov: 52 }} dpr={[1, 1.4]} gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}>
        <Scene />
      </Canvas>
    </div>
  );
}
