import { Canvas as R3FCanvas } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Grid,
  OrbitControls,
  SoftShadows,
  PivotControls,
  GizmoHelper,
  GizmoViewport,
  Text,
} from '@react-three/drei';

export const Canvas = () => {
  return (
    <R3FCanvas
      shadows
      raycaster={{ params: { Line: { threshold: 0.15 } } }}
      className="w-full !h-[500px]"
    >
      {/* Ambiance */}
      <SoftShadows />
      <directionalLight castShadow position={[2.5, 5, 5]} intensity={1.5} shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 50]} />
      </directionalLight>
      <ambientLight intensity={0.5} />

      {/* Cameras */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} near={0.1} far={2000} />

      {/* Objects */}
      <mesh scale={20} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <shadowMaterial transparent opacity={0.5} />
      </mesh>

      <PivotControls
        rotation={[0, -Math.PI / 2, 0]}
        anchor={[1, -1, -1]}
        scale={75}
        depthTest={false}
        fixed
        lineWidth={2}
      >
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
          <Text
            position={[0, 2, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Counting
          </Text>
        </mesh>
      </PivotControls>

      <PivotControls
        rotation={[0, -Math.PI / 2, 0]}
        anchor={[1, -1, -1]}
        scale={75}
        depthTest={false}
        fixed
        lineWidth={2}
      >
        <mesh castShadow receiveShadow position={[2, 4, -2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial />
          <Text
            position={[0, 1, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            The bird
          </Text>
        </mesh>
      </PivotControls>

      <PivotControls
        rotation={[0, -Math.PI / 2, 0]}
        anchor={[1, -1, -1]}
        scale={75}
        depthTest={false}
        fixed
        lineWidth={2}
      >
        <mesh castShadow receiveShadow position={[-10, 0, -20]}>
          <boxGeometry args={[6, 10, 10]} />
          <meshStandardMaterial />
          <Text
            position={[0, 7, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            A mountain
          </Text>
        </mesh>
      </PivotControls>

      {/* Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Global Controls */}
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
    </R3FCanvas>
  );
};
