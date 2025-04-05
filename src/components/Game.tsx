'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const GameWrapperNoSSR = dynamic(() => import('@/game/PhaserGame'), { ssr: false });

export default function Game() {
  return (
    <div className="lg:w-1/2 w-full aspect-[4/3] relative">
      <div className="bottom-[70px] absolute left-[300px]">
        <Image src="/assets/spin.png" alt="Spin Button" width={80} height={80} />
      </div>
      <GameWrapperNoSSR />
    </div>
  );
}
