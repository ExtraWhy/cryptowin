import { mapDtoToBetRequest } from '@/lib/api/mapper';
import { BetRequest } from '@/lib/api/types';
import { fromPromise, setup, assign, ActorLogic } from 'xstate';

export const SLOT_STATES = {
  idle: 'idle',
  starting: 'starting',
  spinning: 'spinning',
  spinning_autoplay: 'spinning_autoplay',
  stopping: 'stopping',
  stopped: 'stopped',
};

export const slotMachine = (
  external_actions: {
    stopSpin: () => Promise<void[]>;
    startSpin: () => Promise<void[]>;
    setUpdateSpin: () => void;
    setUpdateStop: () => void;
    resetAllReels: () => void;
  },
  external_actors: Record<string, ActorLogic<any, any>>,
) =>
  setup({
    types: {
      context: {} as {
        socket_api: {
          bet_request: BetRequest;
        };
        player: {
          balance: number;
          current_bet: number;
          last_win: number;
        };
        game: {
          spinResult: {};
          freeSpinsRemaining: number;
          autoPlayEnabled: boolean;
        };
        session: { sessionId: number };
        count: number;
        updateFunc: (() => {}) | null;
      },
      events: {} as
        | { type: 'TOGGLE' }
        | { type: 'TOGGLE_AUTOPLAY' }
        | { type: 'STOP_SPIN' }
        | { type: 'STOP_COMPLETE' }
        | { type: 'RESET_COMPLETE' }
        | { type: 'RESULT_RECEIVED' }
        | { type: 'SHOW_WIN' }
        | { type: 'AUTOPLAY_TOGGLE' },
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
  }).createMachine({
    id: 'slotmachine',
    initial: 'idle',
    context: {
      count: 0,
      updateFunc: null,
      socket_api: { bet_request: mapDtoToBetRequest(0, 100) },
      player: { balance: 0, current_bet: 0, last_win: 0 },
      game: { spinResult: {}, freeSpinsRemaining: 0, autoPlayEnabled: false },
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
                  onDone: 'success',
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
        always: [
          {
            guard: ({ context }: any) => context.game.autoPlayEnabled,
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
        always: { target: SLOT_STATES.idle },
      },
    },
  });
