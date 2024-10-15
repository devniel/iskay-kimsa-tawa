import { useState, useCallback } from 'react';
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
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import { useSpring } from '@react-spring/three';
import { Asset } from '@/models';

const ImagePlane = ({
  position,
  imageUrl,
  label,
  showControls = false,
  showLabels = false,
  initialScale = [2, 2, 1],
}) => {
  const texture = useLoader(TextureLoader, imageUrl);
  const [scale, setScale] = useState(initialScale);

  const [spring, api] = useSpring(() => ({
    scale: initialScale,
    config: { mass: 1, tension: 280, friction: 60 },
  }));

  const handleResize = useCallback(
    (newScale) => {
      setScale(newScale);
      api.start({ scale: newScale });
    },
    [api]
  );

  return (
    <PivotControls
      rotation={[0, -Math.PI / 2, 0]}
      anchor={[1, -1, -1]}
      scale={100}
      depthTest={false}
      fixed
      lineWidth={2}
      visible={showControls}
    >
      <group position={position}>
        <mesh castShadow receiveShadow scale={scale}>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            map={texture}
            transparent={true}
            side={THREE.DoubleSide}
            alphaTest={0.5}
          />
        </mesh>
        {showLabels && (
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
        )}
        {showControls && (
          <group position={[1, 1, 0]}>
            <mesh onClick={() => handleResize([scale[0] * 1.1, scale[1], 1])}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="green" />
            </mesh>
            <mesh
              position={[0.3, 0, 0]}
              onClick={() => handleResize([scale[0] * 0.9, scale[1], 1])}
            >
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="red" />
            </mesh>
            <mesh
              position={[0, 0.3, 0]}
              onClick={() => handleResize([scale[0], scale[1] * 1.1, 1])}
            >
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="blue" />
            </mesh>
            <mesh
              position={[0, -0.3, 0]}
              onClick={() => handleResize([scale[0], scale[1] * 0.9, 1])}
            >
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="yellow" />
            </mesh>
          </group>
        )}
      </group>
    </PivotControls>
  );
};

export const Canvas = ({ assets }: { assets: Asset[] }) => {
  const { showControls, showLabels, showGrid, showGizmo, showDepthOfField } =
    useControls({
      showControls: {
        value: true,
        label: 'Controls',
      },
      showLabels: {
        value: true,
        label: 'Labels',
      },
      showGrid: {
        value: true,
        label: 'Grid',
      },
      showGizmo: {
        value: true,
        label: 'Gizmo',
      },
      showDepthOfField: {
        value: true,
        label: 'Depth of Field',
      },
    });

  return (
    <R3FCanvas
      shadows
      raycaster={{ params: { Line: { threshold: 0.15 } } }}
      className="bg-black"
      resize={{ offsetSize: true }}
      fog={{ color: 'lightblue', near: 10, far: 1000 }}
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
      <ambientLight intensity={1} />

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
        <shadowMaterial transparent opacity={1} />
      </mesh>

      {assets.map((asset, index) => (
        <ImagePlane
          key={index}
          position={[index * 10, 2, 0]}
          imageUrl={asset.data}
          label={`Asset ${index + 1}`}
          scale={[1, 1, 1]}
          showControls={showControls}
          showLabels={showLabels}
        />
      ))}

      {/* Grid */}
      {showGrid && (
        <Grid
          cellSize={1}
          cellThickness={1}
          cellColor="#6f6f6f"
          sectionSize={3}
          sectionThickness={1.5}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}

      {/* Global Controls */}
      <OrbitControls makeDefault />

      {showGizmo && (
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      )}

      {/** Effects */}
      <EffectComposer>
        {showDepthOfField && (
          <DepthOfField
            focusDistance={0} // Adjust focus
            focalLength={0.02} // Adjust depth strength
            bokehScale={2} // Adjust bokeh strength
            height={480} // Height resolution
          />
        )}
      </EffectComposer>
    </R3FCanvas>
  );
};
