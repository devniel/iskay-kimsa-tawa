import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

interface AssetNodeProps {
  data: {
    type: 'image';
    data: string;
  };
}

export function AssetNode({ data }: AssetNodeProps) {

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="p-4 border border-gray-200 max-w-xl">
        <img src={data.data} alt="object" />
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}
