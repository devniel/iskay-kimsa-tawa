'use client';

import { LightCanvas } from '@/components/LightCanvas';
import { Asset } from '@/models';
import { mockAssets } from '@/services/api';

export default function Sandbox() {
  const assets: Asset[] = Object.values(mockAssets);

  return (
    <div className="h-screen w-[calc(100vh*9/16)] max-w-full aspect-[9/16]">
      <LightCanvas assets={assets} />
    </div>
  );
}
