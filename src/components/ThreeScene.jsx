import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

const Silo = (props) => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        meshRef.current.rotation.y += delta * 0.2;
    });

    return (
        <group {...props}>
            {/* Silo Body */}
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 4, 32]} />
                <meshStandardMaterial color="#795548" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Silo Roof */}
            <mesh position={[0, 2.5, 0]}>
                <coneGeometry args={[1.8, 1.5, 32]} />
                <meshStandardMaterial color="#5d4037" />
            </mesh>
        </group>
    );
};

const ThreeScene = () => {
    return (
        <div className="h-[400px] w-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 2, 8]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Silo position={[0, -1, 0]} />
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
