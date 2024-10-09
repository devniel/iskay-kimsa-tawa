import { Canvas as R3FCanvas } from "@react-three/fiber";

export const Canvas = () => {
  return (
    <R3FCanvas>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </R3FCanvas>
  );
};
