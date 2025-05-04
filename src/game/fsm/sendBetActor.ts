import { mapDtoToBetResult } from '@/lib/api/mapper';
import { BetResult, BetServerResponse } from '@/lib/api/types';
import WebSocketManager, { ServerMessage } from '@/lib/ws';
import { fromPromise } from 'xstate';

export const ws = WebSocketManager();
ws.connect();

var presolve: ((msg: BetResult) => void) | null = null;

ws.onMessage((data: ServerMessage) => {
  if (presolve) {
    const bet_response: BetResult = mapDtoToBetResult(
      data as BetServerResponse,
    );
    presolve(bet_response);
    presolve = null;
  }
});

const sendBetAndWait = fromPromise(async ({ input }) => {
  return new Promise<BetResult>((resolve, reject) => {
    presolve = resolve;
    ws.send(input);
  });
});

export default sendBetAndWait;
