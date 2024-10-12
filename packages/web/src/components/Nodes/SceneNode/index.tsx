import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Scene } from '@/models';

interface SceneNodeProps {
  data: {
    scene: Scene;
    highlights: Record<
      number,
      {
        token: string;
        index: number;
        start: number;
        end: number;
        color: string;
      }
    >;
  };
}

export function SceneNode({ data }: SceneNodeProps) {
  const { scene, highlights } = data;
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="p-4 border border-gray-200 max-w-xl">
        <h3 className="text-lg font-semibold">Scene {scene.scene_number}</h3>
        <p>
          <strong>Location:</strong> {scene.location}
        </p>
        <p>
          <strong>Time:</strong> {scene.time}
        </p>
        <p>
          <strong>POV:</strong> {scene.pov}
        </p>
        <p>
          <strong>Story:</strong>{' '}
          <span style={{ color: highlights[scene.scene_number]?.color }}>
            {scene.story}
          </span>
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}
