'use client';
import { SlotMachineProvider } from '@/game/react/SlotMachineProvider';
import GameContainer from '@/game/react/GameContainer';

export default function Game() {
  return (
    <SlotMachineProvider>
      <GameContainer />
    </SlotMachineProvider>
  );
}
