'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(300);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ size: 2, color: 0xffffff });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    renderer.render(scene, camera);
    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-[9999]">
      <button onClick={onFinish} className="absolute top-4 right-4 text-white px-4 py-2 border">Skip</button>
    </div>
  );
}
