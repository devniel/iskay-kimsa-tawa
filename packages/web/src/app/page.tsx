'use client';

import { useCallback, useEffect, useMemo } from 'react';
import useStore from '../store';
import { Scene } from '../models';
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { StoryNode } from '../components/Nodes/StoryNode';
import { SceneNode } from '../components/Nodes/SceneNode';
import { LayerNode } from '../components/Nodes/LayerNode';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback((options: any) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes().map((node) => ({
        ...node,
        width: node.measured?.width,
        height: node.measured?.height,
      })),
      edges: getEdges(),
    };

    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children?.forEach((node) => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      window.requestAnimationFrame(() => {
        fitView();
      });
    });
  }, []);

  return { getLayoutedElements };
};

const LayoutFlow = () => {
  const nodeTypes = useMemo(
    () => ({ story: StoryNode, scene: SceneNode, layer: LayerNode }),
    []
  );
  const { script, status, setScript, setStatus, loadScript } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getLayoutedElements } = useLayoutedElements();

  useEffect(() => {
    if (script) {
      console.log(' script:', script);
      const storyHighlights = script.scenes.reduce(
        (acc, scene: Scene) => {
          const token = scene.story;
          const index = scene.scene_number;
          const storyIndex = script.story.indexOf(scene.story);
          const start = storyIndex !== -1 ? storyIndex : -1;
          const end = storyIndex !== -1 ? storyIndex + scene.story.length : -1;
          const colors = [
            '#FFB3BA',
            '#BAFFC9',
            '#BAE1FF',
            '#FFDFBA',
            '#E0BBE4',
            '#FFDFD3',
          ];
          const color = colors[index % colors.length];
          acc[scene.scene_number] = {
            token,
            index,
            start,
            end,
            color,
          };
          return acc;
        },
        {} as Record<
          number,
          {
            token: string;
            index: number;
            start: number;
            end: number;
            color: string;
          }
        >
      );
      const nodesUpdate: Node[] = [];
      const edgesUpdate: Edge[] = [];

      // Story node
      nodesUpdate.push({
        id: 'story',
        type: 'story',
        position: { x: 0, y: 0 },
        data: {
          story: script.story,
          highlights: storyHighlights,
        },
      });

      script.scenes.forEach((scene, index) => {
        // Nodes for each scene
        nodesUpdate.push({
          id: `scene-${scene.scene_number}`,
          type: 'scene',
          position: { x: 50, y: 100 * index },
          data: { scene, highlights: storyHighlights[scene.scene_number] },
        });
        // Edges for each scene and its story
        edgesUpdate.push({
          id: `edge-story-scene-${scene.scene_number}`,
          source: 'story',
          target: `scene-${scene.scene_number}`,
          type: 'smoothstep',
        });
      });

      script.scenes.forEach((scene) =>
        scene.layers.forEach((layer, layerIndex) => {
          // Nodes for each layer
          nodesUpdate.push({
            id: `layer-${scene.scene_number}-${layerIndex}`,
            type: 'layer',
            position: {
              x: 100,
              y: 100 * scene.scene_number + 100 * layerIndex,
            },
            data: { layer },
          });
          // Edges for each layer and its scene
          edgesUpdate.push({
            id: `edge-scene-${scene.scene_number}-layer-${layerIndex}`,
            source: `scene-${scene.scene_number}`,
            target: `layer-${scene.scene_number}-${layerIndex}`,
            type: 'smoothstep',
          });
        })
      );

      setNodes(nodesUpdate);
      setEdges(edgesUpdate);

      setTimeout(() => {
        getLayoutedElements({
          'elk.algorithm': 'layered',
          'elk.direction': 'RIGHT',
          'elk.layered.considerModelOrder.strategy': 'PREFER_NODES',
        });
      }, 100);
    }
  }, [script]);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      colorMode="dark"
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default function Home() {
  const { loadScript } = useStore();

  useEffect(() => {
    loadScript();
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen">
        <LayoutFlow />
      </div>
    </ReactFlowProvider>
  );
}
