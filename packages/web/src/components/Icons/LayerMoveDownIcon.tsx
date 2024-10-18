import React from 'react';

interface LayerMoveDownIconProps {
  size?: number;
  className?: string;
}

export function LayerMoveDownIcon({
  size = 24,
  className = '',
}: LayerMoveDownIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="0" width="20" height="20" rx="2" fill={'#FFF'} />
      <rect x="0" y="4" width="20" height="20" rx="2" fill={'#999'} />
    </svg>
  );
}
