import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as R3FCanvas, useThree } from '@react-three/fiber';
import { SoftShadows, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Asset } from '@/models';
import { ImageMesh } from './ImageMesh';
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { LayerMoveUpIcon } from '../Icons/LayerMoveUpIcon';
import { LayerMoveDownIcon } from '../Icons/LayerMoveDownIcon';

interface MeshSetting {
  id: string;
  scale: [number, number, number];
  position: [number, number, number];
  imageUrl: string;
}

interface InteractionHandlerProps {
  meshSettings: MeshSetting[];
  updateImagePlanePosition: (
    id: string,
    newPosition: [number, number, number]
  ) => void;
  floorPlane: THREE.Plane;
  debug?: boolean;
  onSelectedMeshChange: (
    id: string | null,
    { x, y }: { x: number; y: number }
  ) => void;
}

const InteractionHandler = ({
  meshSettings,
  updateImagePlanePosition,
  floorPlane,
  debug,
  onSelectedMeshChange,
}: InteractionHandlerProps) => {
  const { camera, raycaster, scene, gl } = useThree();
  const draggedMeshId = useRef<string | null>(null);
  const dragStartPosition = useRef(new THREE.Vector3());
  const dragOffset = useRef(new THREE.Vector3());

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

  const getMousePosition = useCallback(
    (event: MouseEvent) => {
      // Get the canvas element
      const canvas = gl.domElement;
      // Get the bounding rectangle of the canvas
      const rect = canvas.getBoundingClientRect();
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return mouse;
    },
    [gl]
  );

  const handlePointerMove = useCallback(
    (event: MouseEvent) => {
      if (draggedMeshId.current) {
        const mouse = getMousePosition(event);
        raycaster.setFromCamera(mouse, camera);
        const intersectionPoint = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(floorPlane, intersectionPoint)) {
          const draggedMesh = meshSettings.find(
            (mesh) => mesh.id === draggedMeshId.current
          );

          if (draggedMesh) {
            // Apply the stored offset to the new intersection point
            const newPosition = new THREE.Vector3().addVectors(
              intersectionPoint,
              dragOffset.current
            );
            updateImagePlanePosition(draggedMeshId.current, [
              newPosition.x,
              newPosition.y,
              draggedMesh.position[2], // Keep the original Z position
            ]);
          }
        }
      }
    },
    [
      camera,
      raycaster,
      floorPlane,
      updateImagePlanePosition,
      meshSettings,
      getMousePosition,
    ]
  );

  const handlePointerUp = useCallback(() => {
    if (draggedMeshId.current) {
      draggedMeshId.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
  }, [draggedMeshId, handlePointerMove]);

  const handlePointerDown = useCallback(
    (event: MouseEvent) => {
      const mouse = getMousePosition(event);
      raycaster.setFromCamera(mouse, camera);

      // Update ray helper
      if (debug) {
        rayHelper.current.setDirection(raycaster.ray.direction);
        rayHelper.current.position.copy(raycaster.ray.origin);
      }

      // Perform intersection test
      // Set second argument as false as we don't need to check children
      const intersectionPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(floorPlane, intersectionPoint)) {
        // Find the closest image plane to the intersection point
        let closestMesh: MeshSetting | null = null;
        let closestDistance = Infinity;

        meshSettings.forEach((meshSetting) => {
          const meshPosition = new THREE.Vector3(...meshSetting.position);
          const distance = meshPosition.distanceTo(intersectionPoint);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestMesh = meshSetting;
          }
        });

        if (closestMesh) {
          const position = (closestMesh as MeshSetting).position;
          // Adjust threshold as needed
          draggedMeshId.current = (closestMesh as MeshSetting).id;
          dragStartPosition.current.set(...position);
          // Calculate and store the offset between the intersection point and the mesh's current position
          const meshPosition = new THREE.Vector3(...position);
          dragOffset.current.subVectors(meshPosition, intersectionPoint);

          onSelectedMeshChange(draggedMeshId.current, {
            x: intersectionPoint.x,
            y: intersectionPoint.y,
          });
          window.addEventListener('pointermove', handlePointerMove);
          window.addEventListener('pointerup', handlePointerUp);
        }
      }
    },
    [
      camera,
      raycaster,
      floorPlane,
      meshSettings,
      getMousePosition,
      onSelectedMeshChange,
      handlePointerMove,
      handlePointerUp,
      debug,
    ]
  );

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
  const [selectedMesh, setSelectedMesh] = useState<{
    id: string;
    origin: { x: number; y: number };
  } | null>(null);
  const [meshSettings, setMeshSettings] = useState<MeshSetting[]>(
    assets.map((asset, index) => ({
      id: asset.id,
      scale: [1, 1, 1],
      position: [index * 0.1, 0, 0] as [number, number, number],
      imageUrl: asset.data,
    }))
  );

  const handleUpdateImageMeshPosition = useCallback(
    (id: string, newPosition: [number, number, number]) => {
      setMeshSettings((prev) => {
        return prev.map((m) =>
          m.id === id ? { ...m, position: newPosition } : m
        );
      });
    },
    []
  );

  const handleOnSelectedMeshChange = (
    id: string | null,
    { x, y }: { x: number; y: number }
  ) => {
    if (!id) {
      setSelectedMesh(null);
    } else {
      setSelectedMesh({
        id,
        origin: {
          x,
          y,
        },
      });
    }
  };

  const handleOnResizeUpMesh = () => {
    if (selectedMesh) {
      setMeshSettings((prev) =>
        prev.map((m) => {
          const scale = m.scale.map((s) => s * 1.1) as [number, number, number];
          return m.id === selectedMesh.id
            ? {
                ...m,
                scale,
              }
            : m;
        })
      );
    }
  };

  const handleOnResizeDownMesh = () => {
    if (selectedMesh) {
      setMeshSettings((prev) =>
        prev.map((m) => {
          const scale = m.scale.map((s) => s * 0.9) as [number, number, number];
          return m.id === selectedMesh.id
            ? {
                ...m,
                scale,
              }
            : m;
        })
      );
    }
  };

  const handleOnLayerDownMesh = () => {
    if (selectedMesh) {
      setMeshSettings((prev) => {
        const index = prev.findIndex((m) => m.id === selectedMesh.id);
        if (index > 0) {
          const newMeshes = [...prev];
          [newMeshes[index - 1], newMeshes[index]] = [
            newMeshes[index],
            newMeshes[index - 1],
          ];
          return newMeshes;
        }
        return prev;
      });
    }
  };

  const handleOnLayerUpMesh = () => {
    if (selectedMesh) {
      setMeshSettings((prev) => {
        const index = prev.findIndex((m) => m.id === selectedMesh.id);
        if (index < prev.length - 1) {
          const newMeshes = [...prev];
          [newMeshes[index], newMeshes[index + 1]] = [
            newMeshes[index + 1],
            newMeshes[index],
          ];
          return newMeshes;
        }
        return prev;
      });
    }
  };

  const handleOnRemoveMesh = () => {
    if (selectedMesh) {
      setMeshSettings((prev) => prev.filter((m) => m.id !== selectedMesh.id));
      setSelectedMesh(null);
    }
  };

  return (
    <>
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
          meshSettings={meshSettings}
          floorPlane={floorPlane.current}
          updateImagePlanePosition={handleUpdateImageMeshPosition}
          onSelectedMeshChange={handleOnSelectedMeshChange}
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
          <shadowMaterial transparent opacity={0.5} />
        </mesh>

        {/* Image Meshes */}
        {meshSettings.map(({ id, position, imageUrl, scale }, index) => (
          <ImageMesh
            key={id}
            id={id}
            position={position}
            imageUrl={imageUrl}
            scale={scale}
            renderOrder={index}
          />
        ))}
      </R3FCanvas>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
        {selectedMesh ? (
          <div className="flex items-center justify-between">
            <img
              alt="Selected asset"
              className="w-10 h-10"
              src={meshSettings.find((m) => m.id === selectedMesh.id)?.imageUrl}
            />
            <button
              className="text-white inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Resize up"
              onClick={handleOnResizeUpMesh}
            >
              <ArrowsPointingOutIcon className="h-10 w-10" />
            </button>
            <button
              className="text-white inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Resize down"
              onClick={handleOnResizeDownMesh}
            >
              <ArrowsPointingInIcon className="h-10 w-10" />
            </button>
            <button
              className="text-white inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Layer up"
              onClick={handleOnLayerDownMesh}
            >
              <LayerMoveDownIcon className="h-10 w-10" />
            </button>
            <button
              className="text-white inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Layer down"
              onClick={handleOnLayerUpMesh}
            >
              <LayerMoveUpIcon className="h-10 w-10" />
            </button>
            <button
              className="text-white inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Deselect"
              onClick={() => handleOnRemoveMesh()}
            >
              <TrashIcon className="h-10 w-10" />
            </button>
          </div>
        ) : (
          <span>No sticker selected</span>
        )}
      </div>
    </>
  );
};
