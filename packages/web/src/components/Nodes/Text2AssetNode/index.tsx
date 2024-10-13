import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layer } from '@/models';

interface Text2AssetNodeProps {
  data: {
    prompt: string;
  };
}

export function Text2AssetNode({ data }: Text2AssetNodeProps) {
  const { prompt } = data;
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="p-4 border border-gray-200 max-w-xl">
        <button className="bg-blue-500 text-white p-2 rounded">Generate</button>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}
