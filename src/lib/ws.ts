// websocket.ts
import { WS_URL } from '@/lib/api/api';
import log from '@/lib/logger';
export type ServerMessage = {};

let socket: WebSocket | null = null;
let listener: ((data: ServerMessage) => void) | null = null;

export default function WebSocketManager() {
  return {
    connect(url: string = WS_URL): void {
      if (socket && socket.readyState <= 1) {
        console.warn('[WS] Already connected or connecting');
        return;
      }

      socket = new WebSocket(url);

      socket.addEventListener('open', () => {
        log.good('[WS] Connected to', url);
      });

      socket.addEventListener('message', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as ServerMessage;
          log.good('[WS] Raw message received:', data);

          if (listener) {
            listener(data);
          }
        } catch (err) {
          console.error('[WS] Failed to parse raw message:', event.data, err);
        }
      });

      socket.addEventListener('close', () => {
        log.warn('[WS] Connection closed');
      });

      socket.addEventListener('error', (err) => {
        log.error('[WS] Error:', err);
      });
    },

    send(data: unknown): void {
      if (socket?.readyState === WebSocket.OPEN) {
        log.info('sending ws', data);
        socket.send(JSON.stringify(data));
      } else {
        log.error('[WS] Cannot send, socket not open:', data);
      }
    },

    onMessage(callback: (data: ServerMessage) => void): void {
      listener = callback;
    },

    offMessage(): void {
      listener = null;
    },

    close(): void {
      if (socket) {
        socket.close();
        socket = null;
      }
    },

    isConnected(): boolean {
      return socket?.readyState === WebSocket.OPEN;
    },
  };
}
