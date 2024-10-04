'use client';

import { useEffect } from 'react';
import useStore from './store';

export default function Home() {
  const { script, status, setScript, setStatus, loadScript } = useStore();

  useEffect(() => {
    loadScript();
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error</div>;
  if (!script) return <div>No script</div>;

  return <div>{script?.title}</div>;
}
