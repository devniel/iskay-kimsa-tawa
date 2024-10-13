import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layer } from '@/models';

interface AssetNodeProps {
  data: {
    object: {
      type: 'image';
      data: any;
    };
  };
}

export function AssetNode({ data }: AssetNodeProps) {
  const { object } = data;
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="p-4 border border-gray-200 max-w-xl">
        <img src={object.data} alt="object" />
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}
