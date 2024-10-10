'use client';

import { useEffect } from 'react';
import useStore from '../store';
import clsx from 'clsx';
import { Scene } from '../models';
import { Canvas } from '../components/Canvas';

export default function Home() {
  const { script, status, setScript, setStatus, loadScript } = useStore();

  useEffect(() => {
    loadScript();
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error</div>;
  if (!script) return <div>No script</div>;

  // Extract the story highlights from the script scenes
  const storyHighlights = script.scenes.reduce(
    (acc, scene: Scene) => {
      const token = scene.story;
      const index = scene.scene_number;
      const storyIndex = script.story.indexOf(scene.story);
      const start = storyIndex !== -1 ? storyIndex : -1;
      const end = storyIndex !== -1 ? storyIndex + scene.story.length : -1;
      const colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFDFBA', '#E0BBE4', '#FFDFD3'];
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
    {} as Record<number, { token: string; index: number; start: number; end: number; color: string }>
  );

  console.log(storyHighlights);

  return (
    <div className="m-auto p-4 flex flex-col gap-2">
      <style>
        {`
        ${Object.values(storyHighlights)
          .map(
            (highlight) => `
        .tokens > *:nth-child(n+${highlight.start + 1}):nth-child(-n+${highlight.end}) {
          background-color: ${highlight.color};
          color: black;
        }
        `
          )
          .join('\n')}
      `}
      </style>
      <h6 className="text-2xl">{script?.title}</h6>
      <div className="grid" style={{ gridTemplateColumns: '200px 300px 700px 1000px 500px' }}>
        <div className="p-4 border border-gray-200">
          <div className="prose prose-lg prose-indigo whitespace-pre-line dark:text-white">Story</div>
          <div className={clsx('tokens', 'prose prose-lg prose-indigo whitespace-pre-line dark:text-white italic')}>
            {script?.story?.split('').map((token: string, index: number) => (
              <>
                {token === '\n' ? (
                  <br key={index} />
                ) : (
                  <span key={index} className="inline-block rounded">
                    {token === ' ' ? <span className="inline-block m-1"></span> : token}
                  </span>
                )}
              </>
            ))}
          </div>
        </div>
        <div className="p-4 border border-gray-200">
          <div className="prose prose-lg prose-indigo whitespace-pre-line dark:text-white">Scenes</div>
          {script.scenes.map((scene, index) => (
            <div key={index} className="mb-4 border border-gray-200 p-4">
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
                <span style={{ color: storyHighlights[scene.scene_number]?.color }}>{scene.story}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border border-gray-200">
          <div className="prose prose-lg prose-indigo whitespace-pre-line dark:text-white">Layers</div>
          {script.scenes.map((scene, sceneIndex) => (
            <div key={sceneIndex} className="mb-4 border border-gray-200 p-4">
              <h4 className="text-md font-semibold">Scene {scene.scene_number} Layers</h4>
              {scene.layers.map((layer, layerIndex) => (
                <div key={layerIndex} className="mb-4 border border-gray-200 p-4">
                  <p>
                    <strong>{layer.name}</strong>
                  </p>
                  {layer.character && <p>Character: {layer.character}</p>}
                  {layer.distance && <p>Distance: {layer.distance}</p>}
                  {layer.altitude && <p>Altitude: {layer.altitude}</p>}
                  {layer.sound && <p>Sound: {layer.sound}</p>}
                  {layer.description && <p>Description: {layer.description}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="p-4 border border-gray-200">
          <div className="prose prose-lg prose-indigo whitespace-pre-line dark:text-white">Canvas</div>
          <div className="mt-4">
            <Canvas />
          </div>
        </div>
        <div className="p-4 border border-gray-200">
          <div className="prose prose-lg prose-indigo whitespace-pre-line dark:text-white">Render</div>
          <div className="mt-4"></div>
        </div>
      </div>
    </div>
  );
}
