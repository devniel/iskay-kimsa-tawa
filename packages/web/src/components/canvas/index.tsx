import { Canvas as R3FCanvas, useLoader } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Grid,
  OrbitControls,
  SoftShadows,
  PivotControls,
  GizmoHelper,
  GizmoViewport,
  Text,
  Billboard,
} from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useControls } from 'leva';

const ImagePlane = ({
  position,
  imageUrl,
  label,
  showControls = false,
  scale = [2, 2, 1],
}) => {
  const texture = useLoader(TextureLoader, imageUrl);

  return (
    <PivotControls
      rotation={[0, -Math.PI / 2, 0]}
      anchor={[1, -1, -1]}
      scale={75}
      depthTest={false}
      fixed
      lineWidth={2}
      visible={showControls}
    >
      <group position={position}>
        <Billboard>
          <mesh castShadow receiveShadow scale={scale}>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial
              map={texture}
              transparent={true}
              side={THREE.DoubleSide}
              alphaTest={0.5}
            />
          </mesh>
        </Billboard>
        <Billboard>
          <Text
            position={[0, scale[1] / 2 + 0.5, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </Billboard>
      </group>
    </PivotControls>
  );
};

export const Canvas = () => {
  const { showControls } = useControls({
    showControls: {
      value: false,
      label: 'Controls',
    },
  });
  return (
    <R3FCanvas
      shadows
      raycaster={{ params: { Line: { threshold: 0.15 } } }}
      className="w-full !h-[500px] bg-slate-700"
    >
      {/* Ambiance */}
      <SoftShadows />
      <directionalLight
        castShadow
        position={[2.5, 5, 5]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-5, 5, 5, -5, 1, 50]}
        />
      </directionalLight>
      <ambientLight intensity={0.5} />

      {/* Cameras */}
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 10]}
        near={0.1}
        far={2000}
      />

      {/* Objects */}
      <mesh scale={20} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <shadowMaterial transparent opacity={0.5} />
      </mesh>

      <ImagePlane
        position={[0, 2, 0]}
        imageUrl="/1.png"
        label="Counting"
        scale={[2, 2, 1]}
        showControls={showControls}
      />

      <ImagePlane
        position={[-10, 3, -20]}
        imageUrl="/2.png"
        label="A mountain"
        scale={[6, 10, 10]}
        showControls={showControls}
      />

      <ImagePlane
        position={[2, 4, -2]}
        imageUrl="/3.png"
        label="Condor"
        scale={[1, 1, 1]}
        showControls={showControls}
      />

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
