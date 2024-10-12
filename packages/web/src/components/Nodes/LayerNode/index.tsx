import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layer } from '@/models';

interface LayerNodeProps {
  data: {
    layer: Layer;
  };
}

export function LayerNode({ data }: LayerNodeProps) {
  const { layer } = data;
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="p-4 border border-gray-200 max-w-xl">
        <p>
          <strong>{layer.name}</strong>
        </p>
        {layer.character && <p>Character: {layer.character}</p>}
        {layer.distance && <p>Distance: {layer.distance}</p>}
        {layer.altitude && <p>Altitude: {layer.altitude}</p>}
        {layer.sound && <p>Sound: {layer.sound}</p>}
        {layer.description && <p>Description: {layer.description}</p>}
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}
