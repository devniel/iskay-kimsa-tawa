import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';

interface StoryNodeProps {
  data: {
    story: string;
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

export function StoryNode({ data }: StoryNodeProps) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="p-4 border border-gray-200 max-w-xl min-w-lg w-[450px]">
      <style>
        {`
        ${Object.values(data.highlights)
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
      <div
        className={clsx(
          'tokens',
          'prose prose-lg prose-indigo whitespace-pre-line dark:text-white italic'
        )}
      >
        {data?.story?.split('').map((token: string, index: number) => (
          <>
            {token === '\n' ? (
              <br key={index} />
            ) : (
              <span key={index} className="inline-block rounded">
                {token === ' ' ? (
                  <span className="inline-block m-1"></span>
                ) : (
                  token
                )}
              </span>
            )}
          </>
        ))}
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
}
