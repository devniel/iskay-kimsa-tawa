import React, { forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three';
import { animated } from '@react-spring/three';
import * as THREE from 'three';

interface ImageMeshProps {
  position: [number, number, number];
  imageUrl: string;
  initialScale?: [number, number, number];
}

export const ImageMesh = forwardRef<THREE.Mesh, ImageMeshProps>(
  ({ position, imageUrl, initialScale = [1, 1, 1] }, ref) => {
    const texture = useLoader(TextureLoader, imageUrl);

    return (
      <animated.mesh position={position} scale={initialScale} ref={ref}>
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
