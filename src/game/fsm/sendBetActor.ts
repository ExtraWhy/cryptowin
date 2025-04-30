import { mapDtoToBet } from '@/lib/api/mapper';
import { BetResult, BetServerResponse } from '@/lib/api/types';
import WebSocketManager, { ServerMessage } from '@/lib/ws';
import { useRef } from 'react';
import { fromPromise } from 'xstate';

export const ws = WebSocketManager();

var presolve: ((msg: BetResult) => void) | null = null;

ws.onMessage((data: ServerMessage) => {
  if (presolve) {
    const bet_response: BetResult = mapDtoToBet(data as BetServerResponse);
    presolve(bet_response);
    presolve = null;
  }
});

const sendBetAndWait = fromPromise(async ({ input }) => {
  return new Promise<BetResult>((resolve, reject) => {
    const serverJson = {
      id: 'abc123',
      bet_amount: 5,
      win_amount: 0,
      cleo: [
        { Num: [0], XY: [0] },
        { Pay: 2, Mult: 2, Num: [0], Line: 2, XY: [0, 1, 1, 0, 0, 0, 0, 0, 0] },
        { Pay: 2, Mult: 2, Num: [0], Line: 6, XY: [0, 1, 1, 0, 0, 0, 0, 0, 0] },
        {
          Pay: 5,
          Mult: 2,
          Num: [0],
          Line: 10,
          XY: [0, 1, 2, 2, 0, 0, 0, 0, 0],
        },
        {
          Pay: 2,
          Mult: 2,
          Num: [0],
          Line: 16,
          XY: [0, 1, 1, 0, 0, 0, 0, 0, 0],
        },
        {
          Pay: 2,
          Mult: 2,
          Num: [0],
          Line: 20,
          XY: [0, 1, 1, 0, 0, 0, 0, 0, 0],
        },
      ],
      Scr: [
        [1, 7, 3],
        [2, 10, 11],
        [11, 10, 6],
        [11, 6, 7],
        [12, 13, 6],
      ],
    };
    presolve = resolve;
    const bet_response: BetResult = mapDtoToBet(
      serverJson as BetServerResponse,
    );
    presolve(bet_response);
    // One request at a time to prevent race conditions
  });
});

export default sendBetAndWait;

function dependenciesChanged(arr1: any[], arr2: any[]): boolean {
  if (!arr1 || !arr2) return true;
  if (arr1.length !== arr2.length) return true;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return true;
  }
  return false;
}

function useMemo<T>(calcValue: () => T, deps: any[]): T {
  const memo_info = useRef<{ deps: any[]; value: T } | null>(null);
  if (!memo_info.current || dependenciesChanged(memo_info.current.deps, deps)) {
    memo_info.current = { deps: deps, value: calcValue() };
  }

  return memo_info.current.value;
}
