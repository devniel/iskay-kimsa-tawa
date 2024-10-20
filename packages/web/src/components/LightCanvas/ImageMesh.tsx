import React, { forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three';
import { animated } from '@react-spring/three';
import * as THREE from 'three';

interface ImageMeshProps {
  id: string;
  position: [number, number, number];
  imageUrl: string;
  scale?: [number, number, number];
  renderOrder?: number;
}

export const ImageMesh = forwardRef<THREE.Mesh, ImageMeshProps>(
  ({ position, imageUrl, scale = [1, 1, 1], renderOrder = 0 }, ref) => {
    const texture = useLoader(TextureLoader, imageUrl);

    return (
      <animated.mesh
        position={position}
        scale={scale}
        ref={ref}
        renderOrder={renderOrder}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          side={DoubleSide}
        />
      </animated.mesh>
    );
  }
);

ImageMesh.displayName = 'ImageMesh';
