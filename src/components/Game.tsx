'use client';
import { SlotMachineProvider } from '@/game/SlotMachineProvider';
import GameContainer from './GameContainer';

export default function Game() {
  return (
    <SlotMachineProvider>
      <GameContainer />
    </SlotMachineProvider>
  );
}
