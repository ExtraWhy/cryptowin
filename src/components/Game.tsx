'use client';
import dynamic from 'next/dynamic';

const GameWrapperNoSSR = dynamic(() => import('@/game/PhaserGame'), { ssr: false });

export default function Game() {
  return (
    <div className="lg:w-1/2 w-full aspect-[4/3]">
      <GameWrapperNoSSR />
    </div>
  );
}
