/* eslint-disable react/no-unknown-property */
import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Text } from "@react-three/drei";

import { CPU_OPTIONS, GPU_OPTIONS, RAM_OPTIONS, COOLER_OPTIONS, CASE_OPTIONS, SSD_OPTIONS } from "@/data/catalog";

const findBy = (list, value) => list.find((o) => o.value === value);

/* ----------------- Motherboard ----------------- */
function Motherboard() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.4, 0.08, 5.2]} />
        <meshStandardMaterial color="#0d3b1f" metalness={0.3} roughness={0.55} />
      </mesh>
      {/* CPU socket */}
      <mesh position={[-0.8, 0.07, 0.8]} castShadow>
        <boxGeometry args={[1.6, 0.06, 1.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Chipset */}
      <mesh position={[1.5, 0.08, -1.4]} castShadow>
        <boxGeometry args={[0.9, 0.14, 0.9]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* PCIe slots */}
      {[-0.6, -1.0, -1.4].map((z, i) => (
        <mesh key={i} position={[0.8, 0.07, z]}>
          <boxGeometry args={[3.4, 0.05, 0.22]} />
          <meshStandardMaterial color={i === 0 ? "#101010" : "#2a2a2a"} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* RAM slots */}
      {[-2.2, -2.42, -2.64, -2.86].map((x, i) => (
        <mesh key={`r${i}`} position={[x, 0.07, 0.8]}>
          <boxGeometry args={[0.12, 0.05, 2.6]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* 24-pin power */}
      <mesh position={[2.8, 0.08, 0.3]} castShadow>
        <boxGeometry args={[0.3, 0.18, 1.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* M.2 slot area */}
      <mesh position={[0.6, 0.075, 1.7]}>
        <boxGeometry args={[2.4, 0.04, 0.4]} />
        <meshStandardMaterial color="#101010" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ----------------- CPU ----------------- */
function CPU({ part }) {
  if (!part) return null;
  const isIntel = part.brand === "intel";
  const accent = isIntel ? "#0071c5" : "#ed1c24";
  return (
    <group position={[-0.8, 0.13, 0.8]}>
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.18, 1.3]} />
        <meshStandardMaterial color="#d6d6d6" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.0, 0.02, 1.0]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.18} color="#fff" anchorX="center" anchorY="middle">
        {isIntel ? "INTEL" : "AMD"}
      </Text>
    </group>
  );
}

/* ----------------- Cooler ----------------- */
function SpinningFan({ position, color = "#a855f7", size = 0.6 }) {
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 4; });
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[size, size, 0.12, 32]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[size * 0.92, 0.04, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} />
      </mesh>
      <group ref={ref} position={[0, 0.04, 0]}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <mesh key={i} rotation={[0, (i / 7) * Math.PI * 2, 0]}>
            <boxGeometry args={[size * 0.85, 0.05, 0.16]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </group>
  );
}

function Cooler({ part }) {
  if (!part) return null;
  const t = part.type || "air";
  if (t === "air") {
    return (
      <group position={[-0.8, 1.0, 0.8]}>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.06 - 0.42, 0]}>
            <boxGeometry args={[1.3, 0.04, 1.6]} />
            <meshStandardMaterial color="#c0c4c8" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
        <SpinningFan position={[0, 0.55, 0]} color="#d4a843" size={0.7} />
      </group>
    );
  }
  const radLen = t === "liquid360" ? 4.5 : 3.1;
  const fanCount = t === "liquid360" ? 3 : 2;
  const colors = ["#a855f7", "#00c8ff", "#ec4899"];
  return (
    <group>
      {/* Pump on CPU */}
      <mesh position={[-0.8, 0.34, 0.8]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.36, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.8, 0.53, 0.8]}>
        <cylinderGeometry args={[0.4, 0.4, 0.04, 32]} />
        <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={1.6} />
      </mesh>
      {/* Radiator on top */}
      <group position={[0, 3.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[radLen, 0.45, 1.4]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
        </mesh>
        {Array.from({ length: fanCount }).map((_, i) => {
          const x = (i - (fanCount - 1) / 2) * (radLen / fanCount);
          return (
            <group key={i} position={[x, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <SpinningFan position={[0, 0, 0]} color={colors[i % 3]} size={0.55} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

/* ----------------- RAM ----------------- */
function RAM({ part }) {
  if (!part) return null;
  const sticks = part.sticks || 1;
  return (
    <group>
      {Array.from({ length: sticks }).map((_, i) => (
        <group key={i} position={[-2.2 - i * 0.22, 0.5, 0.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.9, 2.4]} />
            <meshStandardMaterial color={part.color || "#22c55e"} metalness={0.55} roughness={0.4} />
          </mesh>
          {/* RGB top */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.18, 0.06, 2.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ----------------- GPU ----------------- */
function GPU({ part }) {
  if (!part) return null;
  const fans = part.fans || 2;
  const isNv = part.brand === "nvidia";
  const length = fans === 3 ? 4.2 : 3.2;
  return (
    <group position={[0.8, 0.55, -0.6]}>
      <mesh castShadow>
        <boxGeometry args={[length, 0.9, 1.6]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[length, 0.2, 1.6]} />
        <meshStandardMaterial color="#444" metalness={0.85} roughness={0.3} />
      </mesh>
      {Array.from({ length: fans }).map((_, i) => {
        const x = (i - (fans - 1) / 2) * (length / fans);
        return (
          <SpinningFan key={i} position={[x, 0.5, 0]} color={isNv ? "#76b900" : "#ed1c24"} size={0.55} />
        );
      })}
      <Text position={[0, -0.05, 0.82]} fontSize={0.22} color={isNv ? "#76b900" : "#ed1c24"} anchorX="center">
        {isNv ? "GeForce RTX" : "Radeon RX"}
      </Text>
    </group>
  );
}

/* ----------------- SSD ----------------- */
function SSD({ part }) {
  if (!part) return null;
  return (
    <group position={[0.6, 0.12, 1.7]}>
      <mesh castShadow>
        <boxGeometry args={[2.2, 0.06, 0.32]} />
        <meshStandardMaterial color="#0a3b8a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.2, 0.04, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

/* ----------------- PSU ----------------- */
function PSU() {
  return (
    <group position={[0, -1.2, -1.6]}>
      <mesh castShadow>
        <boxGeometry args={[5.8, 0.9, 1.6]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.5} />
      </mesh>
      <group position={[-1.6, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.4, 0.03, 8, 24]} />
          <meshStandardMaterial color="#d4a843" emissive="#d4a843" emissiveIntensity={1.0} />
        </mesh>
      </group>
    </group>
  );
}

/* ----------------- Case shell ----------------- */
function CaseShell({ part }) {
  if (!part) return null;
  const isWhite = part.color === "white";
  const baseColor = isWhite ? "#ededee" : "#0a0a0e";
  const frameColor = isWhite ? "#bcbcbe" : "#1a1a1f";
  const neon = part.neon || "#d4a843";

  // Cutaway view: hide RIGHT side panel and FRONT panel so user sees inside.
  // Keep: bottom, top (partial), back, left + corner frame + RGB strips
  return (
    <group>
      {/* Bottom */}
      <mesh position={[0, -1.92, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.15, 5.8]} />
        <meshStandardMaterial color={baseColor} metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Top (only back half so we still see internals from above-front) */}
      <mesh position={[0, 3.55, -1.0]}>
        <boxGeometry args={[7.4, 0.12, 3.8]} />
        <meshStandardMaterial color={baseColor} metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 0.8, -2.85]}>
        <boxGeometry args={[7.4, 5.4, 0.08]} />
        <meshStandardMaterial color={baseColor} metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Left panel (solid back of the case in this view orientation) */}
      <mesh position={[3.7, 0.8, -1.0]}>
        <boxGeometry args={[0.08, 5.4, 3.8]} />
        <meshStandardMaterial color={baseColor} metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Corner frame posts */}
      {[[3.7, 0.8, 2.82], [3.7, 0.8, -2.82], [-3.7, 0.8, 2.82], [-3.7, 0.8, -2.82]].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.1, 5.4, 0.1]} />
          <meshStandardMaterial color={frameColor} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
      {/* Top/Bottom edge frames around glass */}
      <mesh position={[0, 3.4, 2.82]}>
        <boxGeometry args={[7.45, 0.08, 0.08]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[0, -1.8, 2.82]}>
        <boxGeometry args={[7.45, 0.08, 0.08]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[-3.7, 3.4, 0]}>
        <boxGeometry args={[0.08, 0.08, 5.7]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[-3.7, -1.8, 0]}>
        <boxGeometry args={[0.08, 0.08, 5.7]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* RGB strips - visible accent */}
      <mesh position={[-3.65, -1.74, 0]}>
        <boxGeometry args={[0.08, 0.12, 5.5]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={4.5} />
      </mesh>
      <mesh position={[0, 3.46, 2.78]}>
        <boxGeometry args={[7.0, 0.08, 0.06]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={3.5} />
      </mesh>
      <mesh position={[0, -1.78, 2.78]}>
        <boxGeometry args={[7.0, 0.08, 0.06]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={3.5} />
      </mesh>
      {/* Vertical RGB accent on left corner */}
      <mesh position={[-3.7, 0.8, 2.78]}>
        <boxGeometry args={[0.06, 5.2, 0.06]} />
        <meshStandardMaterial color={neon} emissive={neon} emissiveIntensity={2.5} />
      </mesh>
      {/* Brand label on back panel */}
      <Text position={[2.5, 2.8, -2.8]} rotation={[0, 0, 0]} fontSize={0.32} color={neon} anchorX="center" anchorY="middle">
        ITCAN
      </Text>
    </group>
  );
}

/* ----------------- Scene Root ----------------- */
function SceneRoot({ parts }) {
  const groupRef = useRef();
  const hasCase = !!findBy(CASE_OPTIONS, parts.case);
  useFrame((_, dt) => {
    if (groupRef.current) {
      // Slow auto-rotation; slower when case is open (so user can see inside)
      groupRef.current.rotation.y += dt * (hasCase ? 0.12 : 0.22);
    }
  });

  const cpuObj = findBy(CPU_OPTIONS, parts.cpu);
  const gpuObj = findBy(GPU_OPTIONS, parts.gpu);
  const ramObj = findBy(RAM_OPTIONS, parts.ram);
  const coolerObj = findBy(COOLER_OPTIONS, parts.cooler);
  const caseObj = findBy(CASE_OPTIONS, parts.case);
  const ssdObj = findBy(SSD_OPTIONS, parts.ssd);

  return (
    <group ref={groupRef}>
      <Motherboard />
      <CPU part={cpuObj} />
      <Cooler part={coolerObj} />
      <RAM part={ramObj} />
      <GPU part={gpuObj} />
      <SSD part={ssdObj} />
      {caseObj && <PSU />}
      <CaseShell part={caseObj} />
    </group>
  );
}

export default function ThreeScene({ parts = {} }) {
  return (
    <Canvas
      shadows
      camera={{ position: [11, 6, 11], fov: 42 }}
      dpr={[1, 1.6]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
    >
      <color attach="background" args={["#05050a"]} />
      <fog attach="fog" args={["#05050a", 16, 34]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-6, 4, -4]} intensity={0.55} color="#a855f7" />
      <pointLight position={[6, -2, 4]} intensity={0.35} color="#00c8ff" />
      <pointLight position={[0, 6, 0]} intensity={0.45} color="#d4a843" />

      <Suspense fallback={null}>
        <SceneRoot parts={parts} />
        <Environment preset="city" />
      </Suspense>

      <ContactShadows position={[0, -1.95, 0]} opacity={0.55} scale={15} blur={2.5} far={5} />

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.85}
        enableDamping
        dampingFactor={0.06}
      />
    </Canvas>
  );
}
