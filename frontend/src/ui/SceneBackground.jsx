import { Canvas } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";

export default function SceneBackground() {
  return (
    <Canvas
      className="fixed inset-0 -z-10"
      camera={{ position: [0, 0, 8] }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere args={[1.6, 64, 64]} position={[-2, 0, 0]}>
          <meshStandardMaterial
            color="#60a5fa"
            roughness={0.15}
            metalness={0.6}
          />
        </Sphere>
      </Float>

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere args={[1.2, 64, 64]} position={[2, -1, 0]}>
          <meshStandardMaterial
            color="#a78bfa"
            roughness={0.2}
            metalness={0.5}
          />
        </Sphere>
      </Float>
    </Canvas>
  );
}
