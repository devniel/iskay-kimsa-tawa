import { Handle, Position } from '@xyflow/react';
import { Asset } from '@/models';
import { Canvas } from '@/components/Canvas';

interface CanvasNodeProps {
  data: {
    assets: Asset[];
  };
}

export function CanvasNode({ data }: CanvasNodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="p-4 border border-gray-200 relative" style={{ width: "1366px", height: "768px"}}>
        <Canvas assets={data.assets} />
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}
