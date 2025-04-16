// websocket.ts

export type ServerMessage = {
  won: number;
  name: string;
  lines: unknown; // or a more specific type if you know it
};

let socket: WebSocket | null = null;
let listener: ((data: ServerMessage) => void) | null = null;

export default function WebSocketManager() {
  return {
    connect(url: string): void {
      if (socket && socket.readyState <= 1) {
        console.warn('[WS] Already connected or connecting');
        return;
      }

      socket = new WebSocket(url);

      socket.addEventListener('open', () => {
        console.log('[WS] Connected to', url);
      });

      socket.addEventListener('message', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as ServerMessage;
          console.log('[WS] Raw message received:', data);

          if (listener) {
            listener(data);
          }
        } catch (err) {
          console.error('[WS] Failed to parse raw message:', event.data);
        }
      });

      socket.addEventListener('close', () => {
        console.log('[WS] Connection closed');
      });

      socket.addEventListener('error', (err) => {
        console.error('[WS] Error:', err);
      });
    },

    send(data: unknown): void {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        console.warn('[WS] Cannot send, socket not open:', data);
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
