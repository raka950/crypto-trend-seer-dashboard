
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BitcoinLogo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(80, 80);
    renderer.setClearColor(0x000000, 0);
    
    // Clear any existing content
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create a simple coin shape
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xF7931A,
      metalness: 0.7,
      roughness: 0.3,
    });
    
    const coin = new THREE.Mesh(geometry, material);
    coin.rotation.x = Math.PI / 2;
    scene.add(coin);

    // Add Bitcoin symbol
    const bitcoinTexture = new THREE.MeshStandardMaterial({
      color: 0xF7931A,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xF7931A,
      emissiveIntensity: 0.2,
    });
    
    const symbolGeometry = new THREE.ExtrudeGeometry(
      new THREE.Shape()
        .moveTo(-0.3, -0.5)
        .lineTo(0.3, -0.5)
        .lineTo(0.3, -0.3)
        .lineTo(0.5, -0.3)
        .lineTo(0.5, 0.3)
        .lineTo(0.3, 0.3)
        .lineTo(0.3, 0.5)
        .lineTo(-0.3, 0.5)
        .lineTo(-0.3, 0.3)
        .lineTo(-0.5, 0.3)
        .lineTo(-0.5, -0.3)
        .lineTo(-0.3, -0.3)
        .lineTo(-0.3, -0.5),
      {
        depth: 0.2,
        bevelEnabled: false
      }
    );
    
    const symbol = new THREE.Mesh(symbolGeometry, bitcoinTexture);
    symbol.rotation.x = Math.PI / 2;
    symbol.position.set(0, 0, 0.2);
    symbol.scale.set(0.5, 0.5, 0.5);
    coin.add(symbol);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 2, 10);
    pointLight1.position.set(2, 2, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xF7931A, 2, 10);
    pointLight2.position.set(-2, -2, 5);
    scene.add(pointLight2);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the coin
      coin.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };

    let animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose THREE.js resources
      geometry.dispose();
      material.dispose();
      symbolGeometry.dispose();
      bitcoinTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-[80px] h-[80px] coin-shadow" />;
};

export default BitcoinLogo;
