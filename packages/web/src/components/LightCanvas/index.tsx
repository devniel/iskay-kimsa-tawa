import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as R3FCanvas, useThree } from '@react-three/fiber';
import { SoftShadows, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Asset } from '@/models';
import { ImageMesh } from './ImageMesh';

interface InteractionHandlerProps {
  imagePlaneRefs: React.MutableRefObject<(THREE.Mesh | null)[]>;
  updateImagePlanePosition: (
    mesh: THREE.Mesh,
    newPosition: [number, number, number]
  ) => void;
  floorPlane: THREE.Plane;
  debug?: boolean;
}

const InteractionHandler = ({
  imagePlaneRefs,
  updateImagePlanePosition,
  floorPlane,
  debug,
}: InteractionHandlerProps) => {
  const { camera, raycaster, scene, gl } = useThree();
  const draggedObject = useRef(null);
  const dragStartPosition = useRef(new THREE.Vector3());

  // Debug helpers
  const rayHelper = useRef<THREE.ArrowHelper>(
    new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
      5,
      0xff0000,
      1,
      1
    )
  );

  useEffect(() => {
    if (!debug) return;
    scene.add(rayHelper.current);
    return () => scene.remove(rayHelper.current);
  }, [scene]);

  const getMousePosition = (event: MouseEvent) => {
    // Get the canvas element
    const canvas = gl.domElement;
    // Get the bounding rectangle of the canvas
    const rect = canvas.getBoundingClientRect();
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    return mouse;
  };

  const handlePointerDown = useCallback(
    (event: MouseEvent) => {
      const mouse = getMousePosition(event);
      raycaster.setFromCamera(mouse, camera);

      // Update ray helper
      if (debug) {
        rayHelper.current.setDirection(raycaster.ray.direction);
        rayHelper.current.position.copy(raycaster.ray.origin);
      }

      // Get all meshes in the scene
      const meshes = imagePlaneRefs.current.filter(
        (ref): ref is THREE.Mesh => ref !== null
      );

      // Perform intersection test
      // Set second argument as false as we don't need to check children
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        // Intersects has a list of objects that are intersected by the raycaster
        // We want to get the topmost object, which is the last one in the array
        const topObject = intersects[intersects.length - 1].object;
        draggedObject.current = topObject;
        dragStartPosition.current.copy(topObject.position);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
      }
    },
    [camera, raycaster, scene, imagePlaneRefs]
  );

  const handlePointerMove = useCallback(
    (event: MouseEvent) => {
      if (draggedObject.current) {
        const mouse = getMousePosition(event);
        raycaster.setFromCamera(mouse, camera);
        const intersectionPoint = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(floorPlane, intersectionPoint)) {
          const newPosition: [number, number, number] = [
            intersectionPoint.x,
            intersectionPoint.y,
            dragStartPosition.current.z, // Keep the original Z position
          ];
          updateImagePlanePosition(draggedObject.current, newPosition);
        }
      }
    },
    [camera, raycaster, updateImagePlanePosition]
  );

  const handlePointerUp = useCallback(() => {
    if (draggedObject.current) {
      draggedObject.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [gl, handlePointerDown]);

  return null;
};

export const LightCanvas = ({ assets }: { assets: Asset[] }) => {
  // Floor plane with a normal pointing in the positive z direction
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const imageMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [imageMeshPositions, setImageMeshPositions] = useState(
    assets.map((_, index) => [index * 0.1, 0, 0] as [number, number, number])
  );
  const updateImageMeshPosition = useCallback(
    (mesh: THREE.Mesh, newPosition: [number, number, number]) => {
      const index = imageMeshRefs.current.findIndex((ref) => ref === mesh);
      if (index !== -1) {
        setImageMeshPositions((prev) => {
          const newPositions = [...prev];
          newPositions[index] = newPosition as [number, number, number];
          return newPositions;
        });
      }
    },
    []
  );

  return (
    <R3FCanvas
      shadows
      raycaster={{ params: { Line: { threshold: 0.15 } } }}
      className="bg-black"
      resize={{ offsetSize: true }}
      fog={{ color: 'lightblue', near: 10, far: 1000 }}
      dpr={[1, 2]}
      style={{ touchAction: 'none' }}
    >

      {/* Handler for dragging meshes */}
      <InteractionHandler
        imagePlaneRefs={imageMeshRefs}
        floorPlane={floorPlane.current}
        updateImagePlanePosition={updateImageMeshPosition}
      />

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
      <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={100} />

      {/* Objects */}
      <mesh scale={20} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <shadowMaterial transparent opacity={1} />
      </mesh>

      {/* Image Meshes */}
      {assets.map((asset, index) => (
        <ImageMesh
          ref={(el) => (imageMeshRefs.current[index] = el)}
          key={index}
          position={imageMeshPositions[index]}
          imageUrl={asset.data}
        />
      ))}
    </R3FCanvas>
  );
};
