"use client";

import React from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Environment, Text, Float } from "@react-three/drei";
import { useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface CardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FloatingCardProps {
  data: CardData;
  index: number;
  totalCards: number;
  activeIndex: number;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  onClick: () => void;
  onLearnMore: (data: CardData) => void;
}

function FloatingCard({
  data,
  index,
  activeIndex,
  isTransitioning,
  onTransitionComplete,
  onClick,
  onLearnMore,
}: FloatingCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const transitionProgress = useRef(0);
  const lastActiveIndex = useRef(activeIndex); // Keep this ref to track changes in the activeIndex prop

  // DVD screensaver-style bouncing state - persists across frames
  const bounceState = useRef({
    // Initial positions spread across the viewport
    x: 0,
    y: 0,
    z: -8,
    // Random velocities for each card (different speeds and directions)
    vx: 0,
    vy: 0,
    vz: 0,
    initialized: false,
  });

  // Initialize bounce state with well-distributed starting positions
  const initializeBounce = useCallback(() => {
    if (bounceState.current.initialized) return;

    // Spread cards across different quadrants/areas
    const gridCols = 3;
    const gridRows = 3;
    const col = index % gridCols;
    const row = Math.floor(index / gridCols) % gridRows;

    // Calculate bounds based on viewport
    const boundsX = viewport.width * 0.7;
    const boundsY = viewport.height * 0.6;

    // Distribute starting positions across a grid with some randomness
    const cellWidth = (boundsX * 2) / gridCols;
    const cellHeight = (boundsY * 2) / gridRows;

    bounceState.current.x =
      -boundsX + col * cellWidth + cellWidth * 0.5 + (Math.random() - 0.5) * cellWidth * 0.6;
    bounceState.current.y =
      -boundsY + row * cellHeight + cellHeight * 0.5 + (Math.random() - 0.5) * cellHeight * 0.6;
    bounceState.current.z = -6 - Math.random() * 4; // Varied depth in background

    // Random velocities - each card moves differently
    const speed = 0.008 + Math.random() * 0.012; // Base speed with variation
    const angle = Math.random() * Math.PI * 2; // Random direction
    bounceState.current.vx = Math.cos(angle) * speed * (0.8 + Math.random() * 0.4);
    bounceState.current.vy = Math.sin(angle) * speed * (0.8 + Math.random() * 0.4);
    bounceState.current.vz = (Math.random() - 0.5) * 0.003; // Subtle depth movement

    bounceState.current.initialized = true;
  }, [index, viewport.width, viewport.height]);

  // Reset transition progress when active index changes
  if (lastActiveIndex.current !== activeIndex) {
    transitionProgress.current = 0;
    lastActiveIndex.current = activeIndex;
  }

  const getDepthForIndex = (index: number) => {
    return -8 + index * 0.5; // Example depth calculation
  };

  useFrame(() => {
    if (!meshRef.current) return;

    // Initialize on first frame
    initializeBounce();

    const isActive = index === activeIndex;

    // Track transition progress
    if (isTransitioning && transitionProgress.current < 1) {
      transitionProgress.current += 0.025;
      if (transitionProgress.current >= 1) {
        transitionProgress.current = 1;
        if (isActive) {
          onTransitionComplete();
        }
      }
    }

    // Smooth interpolation speed
    const lerpSpeed = isTransitioning ? 0.05 : 0.04;

    // Target positions
    let targetX: number;
    let targetY: number;
    let targetZ: number;

    if (isActive) {
      // Active card comes to center front
      targetX = 0;
      targetY = 0;
      targetZ = 4.5;
    } else {
      // DVD screensaver bouncing physics for inactive cards
      const bs = bounceState.current;

      // Bounds for bouncing - keep cards within visible area
      const boundsX = viewport.width * 1.5;
      const boundsY = viewport.height * 1.5;
      const boundsZMin = -25;
      const boundsZMax = -10;

      // Update position
      bs.x += bs.vx;
      bs.y += bs.vy;
      bs.z += bs.vz;

      // Bounce off edges - reverse velocity when hitting boundary
      if (bs.x > boundsX || bs.x < -boundsX) {
        bs.vx *= -1;
        bs.x = Math.max(-boundsX, Math.min(boundsX, bs.x));
      }
      if (bs.y > boundsY || bs.y < -boundsY) {
        bs.vy *= -1;
        bs.y = Math.max(-boundsY, Math.min(boundsY, bs.y));
      }
      if (bs.z > boundsZMax || bs.z < boundsZMin) {
        bs.vz *= -1;
        bs.z = Math.max(boundsZMin, Math.min(boundsZMax, bs.z));
      }

      targetX = bs.x;
      targetY = bs.y;
      targetZ = bs.z;
    }

    // Apply smooth interpolation
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      lerpSpeed
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      lerpSpeed
    );
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetZ,
      lerpSpeed
    );

    // Rotation - active card faces forward, others have gentle drift rotation
    const targetRotY = isActive ? 0 : bounceState.current.vx * 8;
    const targetRotX = isActive ? 0 : bounceState.current.vy * 6;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotY,
      0.02
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotX,
      0.02
    );

    // Scale - background cards are 8.0 for immersive effect
    const targetScale = isActive ? 1.6 : 8.0; 
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.04)
    );
  });

  const isActive = index === activeIndex;

  return (
    <group ref={meshRef} position={[0, 0, getDepthForIndex(index)]}>
      <Html
        transform
        distanceFactor={1}
        style={{
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          opacity: isActive ? 1 : 0.3,
          pointerEvents: isTransitioning || !isActive ? "none" : "auto",
        }}
      >
        <div
          onClick={onClick}
          className={cn(
            "rounded-3xl cursor-pointer transition-all duration-700 ease-out",
            "glass border",
            isActive
              ? "w-[560px] min-h-[420px] p-12 border-primary/30 glow-primary"
              : "w-[320px] p-6 border-border/20 hover:border-border/40"
          )}
          style={{
            background: isActive
              ? `linear-gradient(145deg, ${data.color}15 0%, transparent 50%)`
              : `linear-gradient(145deg, ${data.color}08 0%, transparent 30%)`,
          }}
        >
          <div
            className={cn(
              "rounded-2xl flex items-center justify-center transition-all duration-500",
              isActive ? "w-20 h-20 mb-8" : "w-12 h-12 mb-4"
            )}
            style={{ background: `${data.color}20` }}
          >
            <div
              style={{ color: data.color }}
              className={cn(
                "transition-transform duration-500",
                isActive ? "scale-150" : "scale-100"
              )}
            >
              {data.icon}
            </div>
          </div>

          <h3
            className={cn(
              "font-bold text-foreground mb-3 transition-all duration-500 text-balance",
              isActive ? "text-4xl" : "text-lg"
            )}
          >
            {data.title}
          </h3>

          <p
            className={cn(
              "font-medium mb-5 transition-all duration-500",
              isActive ? "text-xl" : "text-sm"
            )}
            style={{ color: data.color }}
          >
            {data.subtitle}
          </p>

          <p
            className={cn(
              "text-muted-foreground leading-relaxed transition-all duration-500",
              isActive ? "text-lg max-w-md" : "text-sm line-clamp-2"
            )}
          >
            {data.description}
          </p>

          {isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLearnMore(data);
              }}
              className="mt-10 px-8 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105 hover:shadow-lg relative z-20"
              style={{
                background: data.color,
                color: "#0a0a14",
              }}
            >
              Learn More
            </button>
          )}
        </div>
      </Html>
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const [positions, setPositions] = React.useState<Float32Array | null>(null);

  React.useEffect(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    setPositions(pos);
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        {positions && (
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        )}
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4ecdc4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshBasicMaterial
        color="#4ecdc4"
        wireframe
        transparent
        opacity={0.05}
      />
    </mesh>
  );
}

interface SceneProps {
  cards: CardData[];
  activeIndex: number;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  onCardClick: (index: number) => void;
  onLearnMore: (data: CardData) => void;
}

function Scene({
  cards,
  activeIndex,
  isTransitioning,
  onTransitionComplete,
  onCardClick,
  onLearnMore,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ecdc4" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#f97316" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} />

      <ParticleField />
      <GridPlane />

      {cards.map((card, index) => (
        <FloatingCard
          key={card.id}
          data={card}
          index={index}
          totalCards={cards.length}
          activeIndex={activeIndex}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
          onClick={() => onCardClick(index)}
          onLearnMore={onLearnMore}
        />
      ))}

      {/* Removed Environment for stability as requested by visual context lost errors */}
    </>
  );
}

interface FloatingCardsSceneProps {
  cards: CardData[];
  activeIndex: number;
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  onCardClick: (index: number) => void;
  onLearnMore: (data: CardData) => void;
}

export default function FloatingCardsScene({
  cards,
  activeIndex,
  isTransitioning,
  onTransitionComplete,
  onCardClick,
  onLearnMore,
}: FloatingCardsSceneProps) {
  return (
    <div className="w-full h-screen fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]} // Limit DPR to reduce GPU load
        gl={{ 
          antialias: false, // Reduced for stability
          powerPreference: "high-performance",
          alpha: false, // Solid background
          preserveDrawingBuffer: false
        }}
      >
        <Scene
          cards={cards}
          activeIndex={activeIndex}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
          onCardClick={onCardClick}
          onLearnMore={onLearnMore}
        />
      </Canvas>
    </div>
  );
}
