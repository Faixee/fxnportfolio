'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Trail, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

const prng = (n: number) => {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
};

type WhaleEntityProps = {
  speed?: number;
  intensity?: number;
  cursorFollow?: boolean;
  scrollTrigger?: boolean;
};

type MeshDistortMaterialInstance = React.ElementRef<typeof MeshDistortMaterial>;

const WhaleEntity = ({ speed = 1.5, intensity = 1, cursorFollow = true, scrollTrigger = true }: WhaleEntityProps) => {
  const headRef = useRef<THREE.Mesh>(null);
  const headMatRef = useRef<MeshDistortMaterialInstance | null>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const blueLightRef = useRef<THREE.PointLight>(null);
  const segmentRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lineGeoRefs = useRef<(THREE.BufferGeometry<THREE.NormalOrGLBufferAttributes> | null)[]>([]);
  
  const { viewport, mouse } = useThree();
  
  // Physics state
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const lastScrollY = useRef(0);
  
  // Interaction State
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Body segments for a more organic feel - Increased count for smoothness
  const segmentCount = 12;
  const segments = useMemo(() => {
    return [...Array(segmentCount)].map(() => new THREE.Vector3());
  }, [segmentCount]);

  // Audio Context for subtle sound
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    // Reset refs array when count changes
    segmentRefs.current = segmentRefs.current.slice(0, segmentCount);
    lineGeoRefs.current = lineGeoRefs.current.slice(0, segmentCount);

    // Initialize Audio Context on first interaction
    const initAudio = () => {
      if (typeof window !== 'undefined' && !audioContext.current) {
        try {
          const AudioContextCtor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioContextCtor) return;
          audioContext.current = new AudioContextCtor();
          oscillator.current = audioContext.current.createOscillator();
          gainNode.current = audioContext.current.createGain();
          
          oscillator.current.type = 'sine';
          oscillator.current.frequency.setValueAtTime(50, audioContext.current.currentTime);
          gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);
          
          oscillator.current.connect(gainNode.current);
          gainNode.current.connect(audioContext.current.destination);
          oscillator.current.start();
        } catch {
          return;
        }
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    return () => {
      try {
        if (oscillator.current) oscillator.current.stop();
        if (audioContext.current) audioContext.current.close();
      } catch {
        return;
      }
    };
  }, []);
  
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // 1. Intelligent Pathfinding
    // Move in a large figure-8 pattern modulated by noise
    const noiseX = noise3D(t * 0.15, 0, 0) * (viewport.width / 1.2);
    const noiseY = noise3D(0, t * 0.15, 0) * (viewport.height / 1.5);
    const zDepth = Math.sin(t * 0.2) * 2 - 2; // Swim in and out of depth

    // Scroll influence
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollOffset = scrollY * 0.005;
    const scrollVel = scrollTrigger ? (scrollY - lastScrollY.current) / Math.max(delta, 0.001) : 0;
    lastScrollY.current = scrollY;
    const scrollBoost = scrollTrigger ? THREE.MathUtils.clamp(Math.abs(scrollVel) * 0.0002, 0, 1) : 0;

    // Mouse Interaction
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    const mouseLerp = cursorFollow ? (hovered ? 0.85 : 0.12) : 0;
    targetPos.current.set(
      THREE.MathUtils.lerp(noiseX, mouseX, mouseLerp), // Follow mouse tightly if hovered
      THREE.MathUtils.lerp(noiseY - scrollOffset, mouseY, mouseLerp) + (scrollBoost * Math.sign(scrollVel) * 0.6),
      zDepth + (clicked ? 2 : 0) // Come closer when clicked
    );

    // 2. Smooth Physics
    const accelSpeed = speed * (clicked ? 3 : 1) * (1 + scrollBoost * 1.5);
    const acceleration = targetPos.current.clone().sub(currentPos.current).multiplyScalar(0.015 * accelSpeed);
    velocity.current.add(acceleration);
    velocity.current.multiplyScalar(0.97); // Friction
    currentPos.current.add(velocity.current);

    // Update head
    if (headRef.current) {
      headRef.current.position.copy(currentPos.current);
      
      // Look at direction
      const lookAtTarget = currentPos.current.clone().add(velocity.current.clone().multiplyScalar(10));
      headRef.current.lookAt(lookAtTarget);
      
      // Roll effect when turning
      const roll = velocity.current.x * 0.5;
      headRef.current.rotateZ(roll);
      headRef.current.rotateX(Math.PI / 2); // Orient capsule
    }

    if (headMatRef.current) {
      headMatRef.current.emissiveIntensity = (0.35 + (hovered ? 0.25 : 0) + (clicked ? 0.25 : 0) + scrollBoost * 0.35) * intensity;
      headMatRef.current.distort = 0.15 + (hovered ? 0.05 : 0) + scrollBoost * 0.05;
    }

    // Update body segments (Snake/Chain physics)
    segments[0].copy(currentPos.current);
    
    // Update first segment mesh
    const firstSegment = segmentRefs.current[0];
    if (firstSegment) {
      firstSegment.position.copy(segments[0]);
    }

    for (let i = 1; i < segments.length; i++) {
      const prev = segments[i - 1];
      const curr = segments[i];
      const dist = prev.distanceTo(curr);
      const targetDist = 0.5; // Tighter segments
      if (dist > targetDist) {
        const dir = prev.clone().sub(curr).normalize();
        curr.add(dir.multiplyScalar(dist - targetDist));
      }

      // Update Mesh Position
      const segmentMesh = segmentRefs.current[i];
      if (segmentMesh) {
        segmentMesh.position.copy(curr);
      }

      // Update Line Geometry
      const lineGeo = lineGeoRefs.current[i];
      if (lineGeo) {
        const posAttr = lineGeo.getAttribute('position');
        if (posAttr && 'array' in posAttr) {
          const positions = posAttr.array as Float32Array;
          positions[0] = prev.x;
          positions[1] = prev.y;
          positions[2] = prev.z;
          positions[3] = curr.x;
          positions[4] = curr.y;
          positions[5] = curr.z;
          posAttr.needsUpdate = true;
        }
      }
    }

    if (lightRef.current) {
      lightRef.current.position.copy(currentPos.current);
      // Pulse light
      lightRef.current.intensity = (2 + Math.sin(t * 3) * 1 + scrollBoost * 2) * intensity;
    }
    if (blueLightRef.current) {
      blueLightRef.current.position.copy(currentPos.current);
    }

    // Sound modulation based on speed
    if (gainNode.current && audioContext.current && oscillator.current) {
      const speedMag = velocity.current.length();
      const vol = Math.min(speedMag * 0.1, 0.1); // Subtle volume
      gainNode.current.gain.setTargetAtTime(vol, audioContext.current.currentTime, 0.1);
      oscillator.current.frequency.setTargetAtTime(50 + speedMag * 50, audioContext.current.currentTime, 0.1);
    }
  });

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <pointLight ref={lightRef} distance={20} decay={2} color="#ff0055" />
      <pointLight ref={blueLightRef} distance={10} decay={2} color="#00d2ff" intensity={2} />
      
      {/* Head Entity - Cybernetic Skull */}
      <mesh ref={headRef}>
        <coneGeometry args={[0.8, 2.5, 8]} /> {/* More angular/tech look */}
        <MeshDistortMaterial
          ref={headMatRef}
          color="#020408" // Dark metallic
          emissive="#00d2ff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          speed={2}
          distort={0.2}
          wireframe={clicked} // Tech effect on click
        />
      </mesh>

      {/* Body Segments - Neural Spine */}
      {segments.map((pos, i) => {
        const size = (1 - i / segmentCount) * 0.8; // Tapering
        return (
          <group key={i}>
            <mesh 
              ref={(el) => { segmentRefs.current[i] = el; }}
              position={pos}
            >
              <boxGeometry args={[size, size * 0.6, size * 1.2]} /> {/* Vertebrae shape */}
              <meshStandardMaterial 
                color="#0a101a"
                emissive={i % 3 === 0 ? "#ff0055" : "#00d2ff"} // Alternating neural colors
                emissiveIntensity={1} 
                transparent 
                opacity={0.9}
                wireframe={false}
              />
            </mesh>
            
            {/* Connecting Data Lines */}
            {i > 0 && (
               <line>
                 <bufferGeometry ref={(el) => { lineGeoRefs.current[i] = el; }}>
                    <bufferAttribute 
                      attach="attributes-position" 
                      count={2} 
                      array={new Float32Array(6)} 
                      itemSize={3} 
                      args={[new Float32Array(6), 3]}
                    />
                 </bufferGeometry>
                 <lineBasicMaterial
                   color={i % 2 === 0 ? "#00d2ff" : "#ff0055"}
                   transparent
                   opacity={0.25}
                   blending={THREE.AdditiveBlending}
                 />
               </line>
            )}
          </group>
        );
      })}

      {/* Trailing Particles - Data Wake */}
      <Trail
        width={3}
        length={8}
        color={new THREE.Color('#ff0055')}
        attenuation={(t) => t * t}
      >
        <mesh position={segments[segments.length - 1]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ff0055" transparent opacity={0.5} />
        </mesh>
      </Trail>
    </group>
  );
};

const AIWhaleSystem = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0"> {/* z-0 to be behind content but visible */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'auto' }} // Allow interaction with the canvas content
      >
        <ambientLight intensity={0.12} />
        <hemisphereLight args={["#00d2ff", "#020408", 0.35]} />
        <spotLight position={[50, 50, 50]} angle={0.15} penumbra={1} intensity={2} />
        
        {/* Background Atmosphere */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <fog attach="fog" args={['#020408', 5, 30]} />

        <WhaleEntity cursorFollow scrollTrigger />
        
        {/* Subtle environment particles */}
        <Particles count={100} />
      </Canvas>
    </div>
  );
};

const Particles = ({ count }: { count: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const positionAttrRef = useRef<THREE.BufferAttribute>(null);
  const velocities = useRef<Float32Array | null>(null);

  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (prng(i * 12.9898 + count * 78.233) - 0.5) * 40;
      p[i * 3 + 1] = (prng(i * 39.3467 + count * 11.135) - 0.5) * 40;
      p[i * 3 + 2] = (prng(i * 73.1569 + count * 41.017) - 0.5) * 20;
    }
    return p;
  }, [count]);

  useEffect(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      v[i * 3] = (prng(i * 19.271 + count * 3.17) - 0.5) * 0.015;
      v[i * 3 + 1] = (prng(i * 7.113 + count * 9.29) - 0.5) * 0.02;
      v[i * 3 + 2] = (prng(i * 29.531 + count * 1.71) - 0.5) * 0.01;
    }
    velocities.current = v;
  }, [count]);

  useFrame((_, delta) => {
    if (!positionAttrRef.current || !velocities.current) return;
    const positions = positionAttrRef.current.array as Float32Array;
    const v = velocities.current;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] += v[idx] * (delta * 60);
      positions[idx + 1] += v[idx + 1] * (delta * 60);
      positions[idx + 2] += v[idx + 2] * (delta * 60);

      if (positions[idx] > 20) positions[idx] = -20;
      if (positions[idx] < -20) positions[idx] = 20;
      if (positions[idx + 1] > 20) positions[idx + 1] = -20;
      if (positions[idx + 1] < -20) positions[idx + 1] = 20;
      if (positions[idx + 2] > 10) positions[idx + 2] = -10;
      if (positions[idx + 2] < -10) positions[idx + 2] = 10;
    }

    positionAttrRef.current.needsUpdate = true;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
          args={[points, 3]}
          ref={positionAttrRef}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00d2ff"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default AIWhaleSystem;
