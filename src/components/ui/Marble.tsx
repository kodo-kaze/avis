'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    MeshDistortMaterial,
    Environment,
    Float,
    ContactShadows,
    Lightformer
} from '@react-three/drei';
import * as THREE from 'three';

// --- 3D Component: The Living Stone ---
function MarbleStone() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Slow, heavy rotation to simulate mass
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    });

    return (
        <Float floatIntensity={1} rotationIntensity={0.2} speed={1.5}>
            <mesh ref={meshRef} scale={1.4}>
                {/* Icosahedron gives us a nice geometric base that gets smoothed out */}
                <icosahedronGeometry args={[1, 64]} />

                {/* 
           THE MARBLE SHADER LOGIC:
           - Color: Almost black (#080808)
           - Roughness: 0.1 (Very polished, like wet stone)
           - Metalness: 0.8 (Gives it that deep, reflective obsidian look)
           - Distort: 0.4 (Makes it ripple like liquid stone)
        */}
                <MeshDistortMaterial
                    color="#080808"
                    roughness={0.15}
                    metalness={0.9}
                    distort={0.3}
                    speed={1.5}
                    bumpScale={0.01}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>
        </Float>
    );
}

// --- 3D Scene Wrapper ---
export function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 35 }} gl={{ antialias: true }}>
            <color attach="background" args={['#050505']} />

            {/* 
        Lighting is CRITICAL for the marble look.
        We need sharp white reflections to simulate "veins".
      */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#fff" />

            {/* Environment map acts as the reflection source */}
            <Environment resolution={512}>
                <group rotation={[-Math.PI / 4, -0.3, 0]}>
                    <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                    <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
                    <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
                    <Lightformer intensity={4} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 10, 1]} />
                </group>
            </Environment>

            <MarbleStone />

            <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} color="#000" />
        </Canvas>
    );
}