import { Infinity } from 'lucide-react';
import { SendProp } from './SlotMachineProvider';

export default function AutoPlayButton({
  autoplayActive,
  send,
}: {
  autoplayActive: boolean;
  send: SendProp['send'];
}) {
  return (
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
  );
}
