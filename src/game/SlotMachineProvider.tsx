'use client';
import { createContext, useContext } from 'react';
import { useMachine } from '@xstate/react';
import { slotMachine } from './fsm/StateMachine';
import sendBetAndWait, { ws } from './fsm/sendBetActor';
import { slotAPI } from './PhaserService';

export const SlotMachineContext = createContext<{
  state: any;
  send: (event: any) => void;
} | null>(null);

ws.connect('ws://localhost:8081/ws');
const machine = slotMachine(slotAPI, { sendBetAndWait: sendBetAndWait });

export const SlotMachineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, send] = useMachine(machine);
  console.log('use state', state.value);

  return (
    <SlotMachineContext.Provider value={{ state, send }}>
      {children}
    </SlotMachineContext.Provider>
  );
};

export const useSlotMachine = () => {
  const ctx = useContext(SlotMachineContext);
  if (!ctx) {
    throw new Error(
      'useSlotMachine must be used insldie <SlotMachineProvider>!',
    );
  }
  return ctx;
};
