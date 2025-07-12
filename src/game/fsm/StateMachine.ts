import { mapDtoToBetRequest } from '@/lib/api/mapper';
import { BetRequest, BetResult } from '@/lib/api/types';
import { fromPromise, setup, assign } from 'xstate';

export const SLOT_STATES = {
  idle: 'idle',
  starting: 'starting',
  spinning: 'spinning',
  spinning_autoplay: 'spinning_autoplay',
  stopping: 'stopping',
  stopped: 'stopped',
  show_line_wins: 'show_line_wins',
} as const;

export type SlotState = (typeof SLOT_STATES)[keyof typeof SLOT_STATES];

export type SLOT_EVENTS =
  | { type: 'TOGGLE' }
  | { type: 'TOGGLE_AUTOPLAY' }
  | { type: 'STOP_SPIN' }
  | { type: 'STOP_COMPLETE' }
  | { type: 'RESET_COMPLETE' }
  | { type: 'RESULT_RECEIVED' }
  | { type: 'SHOW_WIN' }
  | { type: 'AUTOPLAY_TOGGLE' };

export type SlotContext = {
  socket_api: {
    bet_request: BetRequest;
  };
  player: {
    balance: number;
    current_bet: number;
    last_win: number;
  };
  game: {
    betResult: BetResult | null;
    freeSpinsRemaining: number;
    autoPlayEnabled: boolean;
  };
  session: { sessionId: number };
  count: number;
  updateFunc: (() => void) | null;
};

export const slotMachine = (
  external_actions: {
    stopSpin: () => Promise<void[]>;
    startSpin: () => Promise<void[]>;
    setUpdateSpin: () => void;
    setUpdateStop: () => void;
    resetAllReels: () => void;
    showLineWins: () => void;
    clearWins: () => void;
  },
  external_actors: Record<string, ReturnType<typeof fromPromise>>,
) =>
  setup({
    types: {
      context: {} as SlotContext,
      events: {} as SLOT_EVENTS,
    },
    actors: external_actors,
    actions: {
      toggleAutoPlay: assign({
        game: ({ context }) => {
          return {
            ...context.game,
            autoPlayEnabled: !context.game.autoPlayEnabled,
          };
        },
      }),
      stopAutoPlay: assign({
        game: ({ context }) => {
          return { ...context.game, autoPlayEnabled: false };
        },
      }),
    },
    guards: {
      hasLineWins: ({ context }: { context: SlotContext }) =>
        Array.isArray(context.game?.betResult?.lines) &&
        context.game.betResult.lines.length > 0,
    },
  }).createMachine({
    id: 'slotmachine',
    initial: 'idle',
    context: {
      count: 0,
      updateFunc: null,
      socket_api: { bet_request: mapDtoToBetRequest(1, 2, 100) },
      player: { balance: 0, current_bet: 0, last_win: 0 },
      game: { betResult: null, freeSpinsRemaining: 0, autoPlayEnabled: false },
      session: { sessionId: 0 },
    },

    on: {
      TOGGLE_AUTOPLAY: {
        actions: 'toggleAutoPlay',
      },
    },

    states: {
      idle: {
        on: {
          TOGGLE: { target: 'starting' /*, actions: 'stopAutoPlay'*/ },
          TOGGLE_AUTOPLAY: { target: 'starting', actions: 'toggleAutoPlay' },
        },
        after: {
          1500: {
            target: SLOT_STATES.starting,
            guard: ({ context }) => context.game.autoPlayEnabled,
          },
        },
      },

      // loads the response from ws and transitions to spinning where events are accepted
      starting: {
        type: 'parallel',
        onDone: { target: 'spinning' },
        states: {
          sendingBet: {
            initial: 'loading',
            states: {
              loading: {
                invoke: {
                  id: 'sendBetAndWait',
                  src: 'sendBetAndWait',
                  input: ({ context: { socket_api } }) =>
                    socket_api.bet_request,
                  onDone: {
                    actions: assign({
                      game: ({
                        context,
                        event,
                      }: {
                        context: SlotContext;
                        event: { type: string; output: BetResult };
                      }) => ({
                        ...context.game,
                        betResult: event.output,
                      }),
                    }),
                    target: 'success',
                  },
                },
              },
              success: { type: 'final' },
            },
          },
          nudgingReels: {
            initial: 'nudging',
            states: {
              nudging: {
                invoke: {
                  id: 'startSpin',
                  src: fromPromise(() => external_actions.startSpin()),
                  onDone: 'success',
                },
              },
              success: { type: 'final' },
            },
          },
          delayedStart: {
            initial: 'waitingForFirstNudge',
            states: {
              waitingForFirstNudge: {
                after: { 150: { target: 'setStartUpdate' } },
              },
              setStartUpdate: {
                type: 'final',
                entry: () => external_actions.setUpdateSpin(),
              },
            },
          },
        },
      },

      spinning: {
        on: {
          TOGGLE: { target: SLOT_STATES.stopping, actions: 'stopAutoPlay' },
        },
        after: {
          1500: {
            target: SLOT_STATES.stopping,
            guard: ({ context }: { context: SlotContext }) =>
              !context.game.autoPlayEnabled,
          },
        },
        always: [
          {
            guard: ({ context }: { context: SlotContext }) =>
              context.game.autoPlayEnabled,
            target: SLOT_STATES.spinning_autoplay,
          },
        ],
      },

      spinning_autoplay: {
        on: { TOGGLE: SLOT_STATES.stopping },
        after: {
          1000: SLOT_STATES.stopping,
        },
      },

      stopping: {
        entry: () => {
          external_actions.setUpdateStop();
        },
        invoke: {
          id: 'stopAllReels',
          src: fromPromise(() => external_actions.stopSpin()),
          onDone: { target: 'stopped' },
        },
      },

      stopped: {
        entry: () => external_actions.resetAllReels(),
        always: [
          { guard: 'hasLineWins', target: SLOT_STATES.show_line_wins },
          { target: SLOT_STATES.idle },
        ],
      },

      show_line_wins: {
        entry: () => external_actions.showLineWins(),
        exit: () => external_actions.clearWins(),
        on: { TOGGLE: SLOT_STATES.starting },
      },
    },
  });
