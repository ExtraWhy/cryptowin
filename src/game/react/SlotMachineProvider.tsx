'use client';
import { createContext, useEffect } from 'react';
import { useMachine, useSelector } from '@xstate/react';
import { SLOT_EVENTS, SlotContext, slotMachine } from '@/game/fsm/StateMachine';
import sendBetAndWait from '@/game/fsm/sendBetActor';
import { ActorRefFrom, SnapshotFrom } from 'xstate';
import { slotAPI } from '@/game/components/PhaserService';
import { BetResult } from '@/lib/api/types';

export const SlotMachineContext = createContext<{
  state: SnapshotFrom<typeof machine>;
  send: (event: SLOT_EVENTS) => void;
} | null>(null);

export type SendProp = { send: (event: SLOT_EVENTS) => void };

const machine = slotMachine(slotAPI, { sendBetAndWait: sendBetAndWait });

let _machine_ref: ActorRefFrom<typeof machine>;

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

export const useGameState = (): SlotContext['game'] => {
  return useSelector(_machine_ref, (snapshot) => snapshot.context.game);
};
export const useBetResult = (): BetResult | null => {
  return useSelector(
    _machine_ref,
    (snapshot) => snapshot.context.game?.betResult,
  );
};

export const useSend = (): ((event: SLOT_EVENTS) => void) => {
  return _machine_ref.send;
};

// ⚠️ WARNING:
// This hook exposes the full slot machine context and bypasses optimal reactivity.
// It is kept only for debugging or temporary access during development.
// Prefer using specialized hooks like `useBetResult` with `useSelector`
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
