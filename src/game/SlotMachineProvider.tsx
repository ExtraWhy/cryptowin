'use client';
import { createContext, useContext, useEffect } from 'react';
import { useMachine, useSelector } from '@xstate/react';
import { slotMachine } from './fsm/StateMachine';
import sendBetAndWait, { ws } from './fsm/sendBetActor';
import { slotAPI } from './PhaserService';
import { ActorRefFrom } from 'xstate';

export const SlotMachineContext = createContext<{
  state: any;
  send: (event: any) => void;
} | null>(null);

ws.connect('ws://localhost:8081/ws');
const machine = slotMachine(slotAPI, { sendBetAndWait: sendBetAndWait });

let _machine_ref: ActorRefFrom<typeof any>;

export const SlotMachineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, send, machine_ref] = useMachine(machine);
  _machine_ref = machine_ref;
  const betResult = useBetResult();

  useEffect(() => {
    if (betResult) {
      slotAPI.handleBetResult(betResult);
    }
  }, [betResult]);

  return (
    <SlotMachineContext.Provider value={{ state, send }}>
      {children}
    </SlotMachineContext.Provider>
  );
};

export const useGameState = (): any => {
  return useSelector(_machine_ref, (snapshot) => snapshot.context.game);
};
export const useBetResult = (): any => {
  return useSelector(
    _machine_ref,
    (snapshot) => snapshot.context.game?.betResult,
  );
};

export const useSend = (): any => {
  return _machine_ref.send;
};

// ⚠️ WARNING:
// This hook exposes the full slot machine context and bypasses optimal reactivity.
// It is kept only for debugging or temporary access during development.
// Prefer using specialized hooks like `useBetResponse` with `useSelector`
/*
export const useSlotMachine = () => {
  const ctx = useContext(SlotMachineContext);
  if (!ctx) {
    throw new Error(
      'useSlotMachine must be used insldie <SlotMachineProvider>!',
    );
  }
  return ctx;
};
*/
