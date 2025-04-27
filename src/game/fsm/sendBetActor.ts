import WebSocketManager, { ServerMessage } from '@/lib/ws';
import { fromPromise } from 'xstate';

export const ws = WebSocketManager();

var presolve: ((msg: ServerMessage) => void) | null = null;

ws.onMessage((data: ServerMessage) => {
  if (presolve) {
    presolve(data);
    presolve = null;
  }
});

const sendBetAndWait = fromPromise(async ({ input }) => {
  return new Promise<ServerMessage>((resolve, reject) => {
    // One request at a time to prevent race conditions
    if (presolve) {
      reject();
    }
    presolve = resolve;
    ws.send(input);
    resolve({ won: 3, name: 'asdf', lines: 's', reels: 'rwe' });
  });
});

export default sendBetAndWait;
