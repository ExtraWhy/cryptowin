'use client';
import { BetPicker } from './BetPicker';

import { useGameState, useSend } from '@/game/react/SlotMachineProvider';
import dynamic from 'next/dynamic';
import SpinButton from './SpinButton';
import AutoPlayButton from './AutoPlayButton';

const GameWrapperNoSSR = dynamic(() => import('@/game/react/PhaserGame'), {
  ssr: false,
});

export default function GameContainer() {
  const state = useGameState();
  const send = useSend();
  const autoplayActive: boolean = state.autoPlayEnabled;

  return (
    <div className="lg:w-1/2 w-full aspect-[4/3] relative max-w-[720px] py-4 border-background-500 border-1 rounded-lg my-5">
      <SpinButton send={send} />
      <AutoPlayButton send={send} autoplayActive={autoplayActive} />
      <BetPicker />
      <GameWrapperNoSSR />
    </div>
  );
}
