'use client';
import { useSlotMachine } from '@/game/SlotMachineProvider';
import { Infinity } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const GameWrapperNoSSR = dynamic(() => import('@/game/PhaserGame'), {
  ssr: false,
});

export default function GameContainer() {
  const { send, state } = useSlotMachine();
  const autoplayActive: boolean = state.context.game.autoPlayEnabled;

  return (
    <div className="lg:w-1/2 w-full aspect-[4/3] relative max-w-[720px] py-4 border-background-500 border-1 rounded-lg my-5">
      <div className="absolute w-[calc(100%-2.9rem)] h-21 bottom-0 bg-[#1B1913] border-[#272625] border-1 my-3 mx-5 rounded-sm">
        <div
          className="px-6 py-2 rounded-lg absolute bottom-[5px] left-[300px] cursor-pointer 
bg-gradient-to-b from-[#2F2718] to-[#15130F] border border-[#3A3A3A] 
transition-all duration-300 ease-in-out 
hover:from-[#15130F] hover:to-[#2F2718] 
hover:shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:scale-105"
          onClick={() => {
            send({ type: 'TOGGLE' });
          }}
        >
          <Image
            src="/assets/spin.png"
            alt="Spin Button"
            width={47}
            height={48}
          />
        </div>
      </div>

      <div
        className={`px-6 py-3 rounded-lg absolute bottom-[30px] left-[430px] cursor-pointer 
bg-gradient-to-b from-[#2F2718] to-[#15130F] border border-[#3A3A3A] 
transition-all duration-300 ease-in-out 
hover:from-[#15130F] hover:to-[#2F2718] 
hover:shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:scale-105 ${autoplayActive ? 'border-3 from-primary to-accent hover:from-primary hover:to-accent' : ''} `}
        onClick={() => {
          send({ type: 'TOGGLE_AUTOPLAY' });
        }}
      >
        <Infinity size={24} />
      </div>

      <GameWrapperNoSSR />
    </div>
  );
}
