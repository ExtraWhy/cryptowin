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
    presolve = resolve;
    ws.send(input);
    //const bet_response: BetResult = mapDtoToBet(
    //  serverJson as BetServerResponse,
    //);
    //presolve(bet_response);
    // One request at a time to prevent race conditions
  });
});

export default sendBetAndWait;
