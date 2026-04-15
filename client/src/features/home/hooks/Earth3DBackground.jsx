import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Earth3DBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Earth texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "https://threejsfundamentals.org/threejs/resources/images/earth-day.jpg"
    );

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    // Responsive
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #020617, #0f172a)"
      }}
    />
  );
}